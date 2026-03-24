import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getExamsBySubject, EXAM_SUBJECTS, EXAM_GRADES, TRAINING_EXAMS } from '../data/exams';

const TYPE_LABEL = {
  ce: { ru: 'Централизованный экзамен', lv: 'Centralizētais eksāmens', uk: 'Централізований іспит' },
  dd: { ru: 'Диагностическая работа',  lv: 'Diagnostiskais darbs',     uk: 'Діагностична робота'  },
};

export default function Exams() {
  const navigate = useNavigate();
  const { state } = useApp();
  const lang = state.language || 'ru';
  const grade = state.grade || 9;
  const t = (obj) => obj[lang] || obj.ru;

  const bySubject = getExamsBySubject(grade);
  const hasExams = Object.keys(bySubject).length > 0;

  // Find closest exam grade for grades without official exams
  const closestGrade = EXAM_GRADES.reduce((prev, curr) =>
    Math.abs(curr - grade) < Math.abs(prev - grade) ? curr : prev
  );
  const nearbyExams = closestGrade !== grade ? getExamsBySubject(closestGrade) : null;

  const savedResults = JSON.parse(localStorage.getItem('exam-results') || '{}');

  function getBestScore(examId) {
    const results = savedResults[examId];
    if (!results || results.length === 0) return null;
    return Math.max(...results.map(r => r.percent));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 pb-10">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pt-6 pb-4">
          <button onClick={() => navigate('/dashboard')} className="text-white/40 hover:text-white/70 text-sm mb-4 flex items-center gap-1 transition-colors">
            ← {lang === 'lv' ? 'Atpakaļ' : lang === 'uk' ? 'Назад' : 'Назад'}
          </button>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">📝</span>
            <div>
              <h1 className="text-white font-black text-2xl leading-tight">
                {lang === 'lv' ? 'Eksāmeni un darbi' : lang === 'uk' ? 'Іспити та контрольні' : 'Экзамены и контрольные'}
              </h1>
              <p className="text-white/40 text-sm">
                {grade} {lang === 'lv' ? '. klase' : lang === 'uk' ? ' клас' : ' класс'}
                {' · '}
                {lang === 'lv' ? 'Latvijas skolas' : lang === 'uk' ? 'Школи Латвії' : 'Школы Латвии'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Exams for current grade */}
        {hasExams ? (
          <div className="flex flex-col gap-6">
            {Object.entries(bySubject).map(([subjectId, exams], si) => {
              const subj = EXAM_SUBJECTS[subjectId];
              if (!subj) return null;
              // Sort by year descending
              const sorted = [...exams].sort((a, b) => b.year - a.year);
              return (
                <motion.div
                  key={subjectId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: si * 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{subj.icon}</span>
                    <h2 className="text-white font-black text-lg">{t(subj.name)}</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {sorted.map((exam, ei) => {
                      const best = getBestScore(exam.id);
                      const typeLabel = TYPE_LABEL[exam.type];
                      return (
                        <motion.div
                          key={exam.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: si * 0.1 + ei * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-white font-black text-base">{exam.year} {lang === 'lv' ? 'gads' : lang === 'uk' ? 'рік' : 'год'}</p>
                              <p className="text-white/40 text-xs">
                                {TRAINING_EXAMS.includes(exam.id) ? (lang === 'lv' ? '🎯 Treniņš' : lang === 'uk' ? '🎯 Тренінг' : '🎯 Тренировка') : t(typeLabel)}
                                {' · '}{exam.duration} {lang === 'lv' ? 'min' : 'мин'} · {exam.questions.length} {lang === 'lv' ? 'uzd.' : 'задан.'}
                              </p>
                            </div>
                            {best !== null && (
                              <div className="text-right">
                                <p className="text-xs text-white/40">{lang === 'lv' ? 'Labākais' : lang === 'uk' ? 'Найкращий' : 'Лучший'}</p>
                                <p className={`font-black text-lg ${best >= 70 ? 'text-green-400' : best >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{best}%</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/exams/${exam.id}`)}
                              className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                            >
                              {best !== null
                                ? (lang === 'lv' ? '🔁 Atkārtot' : lang === 'uk' ? '🔁 Повторити' : '🔁 Повторить')
                                : (lang === 'lv' ? '▶ Sākt' : lang === 'uk' ? '▶ Почати' : '▶ Начать')}
                            </button>
                            <a
                              href={exam.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/10 hover:bg-white/20 text-white/70 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
                            >
                              PDF
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // No official exams for this grade — show nearest
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-amber-300 font-black mb-1">
                {lang === 'lv'
                  ? `${grade}. klasei nav centralizēto eksāmenu`
                  : lang === 'uk'
                  ? `Для ${grade} класу немає централізованих іспитів`
                  : `Для ${grade} класса нет централизованных экзаменов`}
              </p>
              <p className="text-white/50 text-sm">
                {lang === 'lv'
                  ? `Centralizētie eksāmeni ir 3., 6., 9. un 12. klasē. Zemāk redzami ${closestGrade}. klases materiāli sagatavošanai.`
                  : lang === 'uk'
                  ? `Офіційні іспити проводяться у 3, 6, 9 та 12 класах. Нижче — матеріали ${closestGrade} класу для підготовки.`
                  : `Официальные экзамены проводятся в 3, 6, 9 и 12 классах. Ниже — материалы ${closestGrade} класса для подготовки.`}
              </p>
            </div>
            {nearbyExams && Object.entries(nearbyExams).map(([subjectId, exams]) => {
              const subj = EXAM_SUBJECTS[subjectId];
              if (!subj) return null;
              return (
                <div key={subjectId}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{subj.icon}</span>
                    <h2 className="text-white font-black text-lg">{t(subj.name)}</h2>
                    <span className="text-white/30 text-sm">· {closestGrade} {lang === 'lv' ? '. kl.' : 'кл.'}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {exams.sort((a, b) => b.year - a.year).map(exam => (
                      <div key={exam.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-white font-black">{exam.year}</p>
                            <p className="text-white/40 text-xs">{exam.questions.length} {lang === 'lv' ? 'uzd.' : 'задан.'} · {exam.duration} {lang === 'lv' ? 'min' : 'мин'}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/exams/${exam.id}`)}
                          className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                        >
                          {lang === 'lv' ? '▶ Sākt treniņu' : lang === 'uk' ? '▶ Почати тренування' : '▶ Начать тренировку'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Coming soon notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/3 border border-white/8 rounded-2xl p-4 text-center"
        >
          <p className="text-white/30 text-xs">
            {lang === 'lv'
              ? '🚧 Drīzumā: Latviešu valoda, Angļu valoda, vairāk gadu'
              : lang === 'uk'
              ? '🚧 Незабаром: Латвійська мова, Англійська, більше років'
              : '🚧 Скоро: Латышский язык, Английский, больше лет'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
