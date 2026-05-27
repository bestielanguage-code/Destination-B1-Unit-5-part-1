import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Trophy,
  CheckCircle2,
  XCircle,
  Coins,
  Gift,
  ArrowRight,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

const App = () => {
  // --- Game State ---
  const [money, setMoney] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    partA: { correct: 0, wrong: 0, total: 7, attempts: {} },
    partB: { correct: 0, wrong: 0, total: 7, attempts: {} },
    partC: { correct: 0, wrong: 0, total: 5, attempts: {} },
  });

  // --- Data ---
  const questions = {
    partA: [
      {
        id: 1,
        text: "By the time I arrived, everyone _______ (leave)!",
        ans: "had left",
      },
      {
        id: 2,
        text: "Steve _______ (already / see) the film, so he didn't come with us to the cinema.",
        ans: "had already seen",
      },
      {
        id: 3,
        text: "Tina _______ (not/finish) doing the housework by seven o'clock, so she called Andrea.",
        ans: "hadn't finished",
      },
      {
        id: 4,
        text: "_______ (you/just/ speak) to Billy when I rang?",
        ans: "Had you just spoken",
      },
      {
        id: 5,
        text: "The car broke down just after _______ (we/set off).",
        ans: "we had set off",
      },
      {
        id: 6,
        text: "I didn't eat anything at the party because _______ (I/ already / eat) at home.",
        ans: "I had already eaten",
      },
      {
        id: 7,
        text: "_______ (you / hear) about the accident before you saw it on TV?",
        ans: "Had you heard",
      },
    ],
    partB: [
      {
        id: 1,
        q: "We'd had dinner when Wendy arrived.",
        options: [
          "A. Wendy arrived and then we had dinner.",
          "B. We had dinner and then Wendy arrived.",
        ],
        ans: "B",
      },
      {
        id: 2,
        q: "I read the book after I'd seen the film.",
        options: [
          "A. I saw the film and then I read the book.",
          "B. I read the book and then I saw the film.",
        ],
        ans: "A",
      },
      {
        id: 3,
        q: "By the time Dad came home, I'd gone to bed.",
        options: [
          "A. I went to bed before Dad came home.",
          "B. I went to bed after Dad came home.",
        ],
        ans: "A",
      },
      {
        id: 4,
        q: "She didn't go to bed until her mum had come home.",
        options: [
          "A. She went to bed and then her mum came home.",
          "B. Her mum came home and then she went to bed.",
        ],
        ans: "B",
      },
      {
        id: 5,
        q: "Mr Banks hadn't arrived at the office by the time I got there.",
        options: [
          "A. I arrived before Mr Banks.",
          "B. Mr Banks arrived before me.",
        ],
        ans: "A",
      },
      {
        id: 6,
        q: "They'd bought the plane tickets before they heard about the cheaper flight.",
        options: [
          "A. They bought the plane tickets and later they heard about the cheaper flight.",
          "B. They heard about the cheaper flight and then they bought the plane tickets.",
        ],
        ans: "A",
      },
      {
        id: 7,
        q: "The girls had tidied the house when the visitors arrived.",
        options: [
          "A. The visitors arrived and later the girls tidied the house.",
          "B. The girls tidied the house and then the visitors arrived.",
        ],
        ans: "B",
      },
    ],
    partC: [
      {
        id: 1,
        prompt: "we/just/hear / the news/when/you/ring",
        ans: "We had just heard the news when you rang.",
      },
      {
        id: 2,
        prompt: "I/already/think of/that/before/you/suggest/it",
        ans: "I had already thought of that before you suggested it.",
      },
      {
        id: 3,
        prompt: "when/I/turn on/ the TV/ the programme / already / start",
        ans: "When I turned on the TV, the programme had already started.",
      },
      {
        id: 4,
        prompt: "she/be/hungry/because / she / not/eat/anything/ all day",
        ans: "She was hungry because she hadn't eaten anything all day.",
      },
      {
        id: 5,
        prompt: "by the time/ I leave /school/I/decide/to become / a musician",
        ans: "By the time I left school, I had decided to become a musician.",
      },
    ],
  };

  const blindBoxes = [
    {
      type: "Common",
      price: 30,
      color: "bg-slate-100",
      text: "text-slate-600",
      rewards: ["🍎 Táo mọng nước", "📝 Bút chì gỗ", "🥛 Sữa tươi"],
    },
    {
      type: "Rare",
      price: 70,
      color: "bg-blue-100",
      text: "text-blue-600",
      rewards: [
        "⭐ Ngôi sao may mắn",
        "🎨 Bảng màu nghệ thuật",
        "🧸 Gấu bông nhỏ",
      ],
    },
    {
      type: "Legendary",
      price: 150,
      color: "bg-yellow-100",
      text: "text-yellow-600",
      rewards: [
        "👑 Vương miện vàng",
        "🐉 Rồng băng giá",
        "💎 Kim cương vĩnh cửu",
      ],
    },
  ];

  // --- Logic ---
  const handleAnswer = (section, id, userInput) => {
    const q = questions[section].find((item) => item.id === id);
    const isCorrect = userInput.trim().toLowerCase() === q.ans.toLowerCase();
    const alreadyAnswered = stats[section].attempts[id];

    if (alreadyAnswered === "correct") return; // Không cộng tiền lần nữa

    setStats((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        correct: isCorrect ? prev[section].correct + 1 : prev[section].correct,
        wrong: !isCorrect ? prev[section].wrong + 1 : prev[section].wrong,
        attempts: {
          ...prev[section].attempts,
          [id]: isCorrect ? "correct" : "wrong",
        },
      },
    }));

    if (isCorrect) setMoney((m) => m + 10);
  };

  const openBox = (box) => {
    if (money < box.price) return;
    setMoney((m) => m - box.price);
    const reward = box.rewards[Math.floor(Math.random() * box.rewards.length)];
    setInventory((prev) => [...prev, { name: reward, type: box.type }]);
  };

  // --- Components ---
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100"
          >
            <h3 className="text-lg font-bold text-pink-600 mb-2">
              Phần {key.replace("part", "")}
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Đúng:{" "}
                  <span className="text-green-500 font-bold">
                    {value.correct}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Sai:{" "}
                  <span className="text-red-400 font-bold">{value.wrong}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-gray-200">
                  {Math.round((value.correct / value.total) * 100)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400 transition-all duration-500"
                style={{ width: `${(value.correct / value.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
        <h3 className="text-lg font-bold text-pink-600 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Bộ sưu tập của bạn
        </h3>
        {inventory.length === 0 ? (
          <p className="text-gray-400 italic text-center py-8">
            Bạn chưa có món quà nào. Hãy làm bài tập để kiếm tiền mở hộp!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {inventory.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-center text-sm shadow-sm ${
                  item.type === "Legendary"
                    ? "bg-yellow-50 border-yellow-200"
                    : item.type === "Rare"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ExerciseA = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      <p className="text-gray-600 italic mb-6">
        Điền dạng đúng của động từ trong ngoặc (Past Perfect Simple).
      </p>
      {questions.partA.map((q) => (
        <div
          key={q.id}
          className="bg-white p-4 rounded-xl shadow-sm border border-pink-50 transition-all"
        >
          <p className="mb-3 text-gray-700">
            {q.id}. {q.text}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập đáp án..."
              disabled={stats.partA.attempts[q.id] === "correct"}
              className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 ${
                stats.partA.attempts[q.id] === "correct"
                  ? "bg-green-50 border-green-200"
                  : stats.partA.attempts[q.id] === "wrong"
                  ? "bg-red-50 border-red-200"
                  : "border-pink-100 focus:ring-pink-200"
              }`}
              onBlur={(e) => handleAnswer("partA", q.id, e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleAnswer("partA", q.id, e.target.value)
              }
            />
            {stats.partA.attempts[q.id] === "correct" && (
              <CheckCircle2 className="text-green-500 w-6 h-6 self-center" />
            )}
            {stats.partA.attempts[q.id] === "wrong" && (
              <XCircle className="text-red-400 w-6 h-6 self-center" />
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const ExerciseB = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      <p className="text-gray-600 italic mb-6">
        Chọn câu (A hoặc B) có cùng ý nghĩa với câu đầu tiên.
      </p>
      {questions.partB.map((q) => (
        <div
          key={q.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-pink-50"
        >
          <p className="font-bold text-gray-800 mb-4">
            {q.id}. {q.q}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt) => {
              const letter = opt.charAt(0);
              const isSelected =
                stats.partB.attempts[q.id] === letter ||
                (stats.partB.attempts[q.id] === "correct" && q.ans === letter);
              const isCorrect = q.ans === letter;

              return (
                <button
                  key={opt}
                  disabled={stats.partB.attempts[q.id] === "correct"}
                  onClick={() => handleAnswer("partB", q.id, letter)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    stats.partB.attempts[q.id] === "correct" && isCorrect
                      ? "bg-green-100 border-green-300 text-green-700"
                      : isSelected && !isCorrect
                      ? "bg-red-100 border-red-300 text-red-700"
                      : "bg-white border-pink-50 hover:bg-pink-50"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const ExerciseC = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      <p className="text-gray-600 italic mb-6">
        Viết câu sử dụng từ gợi ý (Dùng ít nhất 1 động từ ở Quá khứ hoàn thành).
      </p>
      {questions.partC.map((q) => (
        <div
          key={q.id}
          className="bg-white p-4 rounded-xl shadow-sm border border-pink-50"
        >
          <p className="mb-3 text-gray-700 font-medium">
            {q.id}. {q.prompt}
          </p>
          <div className="flex flex-col gap-2">
            <textarea
              rows="2"
              placeholder="Viết cả câu..."
              disabled={stats.partC.attempts[q.id] === "correct"}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                stats.partC.attempts[q.id] === "correct"
                  ? "bg-green-50 border-green-200"
                  : "border-pink-100 focus:ring-pink-200"
              }`}
              onBlur={(e) => handleAnswer("partC", q.id, e.target.value)}
            />
            {stats.partC.attempts[q.id] === "correct" && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Tuyệt vời! +$10
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const Shop = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto py-6">
      {blindBoxes.map((box) => (
        <div
          key={box.type}
          className={`${box.color} p-8 rounded-3xl text-center space-y-4 shadow-sm relative overflow-hidden group`}
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
            <Gift className="w-20 h-20" />
          </div>
          <h3 className={`text-2xl font-black ${box.text}`}>{box.type} Box</h3>
          <p className="text-gray-500 text-sm italic">
            Cơ hội nhận quà quý hiếm!
          </p>
          <div className="text-3xl font-bold flex items-center justify-center gap-2">
            <Coins className="text-yellow-500" /> {box.price}
          </div>
          <button
            onClick={() => openBox(box)}
            disabled={money < box.price}
            className={`w-full py-3 rounded-2xl font-bold transition-all ${
              money >= box.price
                ? "bg-white shadow-md active:scale-95 hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {money >= box.price ? "Mở Hộp Ngay!" : "Thiếu Tiền"}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffafa] font-sans text-slate-800 pb-20">
      {/* Header / Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-50 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Sparkles className="text-pink-500 w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-pink-600 hidden sm:block">
            Past Perfect Mastery
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-yellow-50 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-100">
            <Coins className="text-yellow-500 w-5 h-5 fill-yellow-500" />
            <span className="font-bold text-yellow-700">${money}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "partA" && <ExerciseA />}
        {activeTab === "partB" && <ExerciseB />}
        {activeTab === "partC" && <ExerciseC />}
        {activeTab === "shop" && <Shop />}
      </main>

      {/* Navigation Bar (Mobile Friendly) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-pink-100 rounded-full px-4 py-2 flex gap-1 sm:gap-4 items-center z-50">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-3 rounded-full flex flex-col items-center transition-colors ${
            activeTab === "dashboard"
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Hồ sơ</span>
        </button>
        <div className="w-[1px] h-8 bg-pink-50" />
        <button
          onClick={() => setActiveTab("partA")}
          className={`p-3 rounded-full flex flex-col items-center transition-colors ${
            activeTab === "partA"
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <span className="font-black text-xs">A</span>
          <span className="text-[10px] font-bold mt-1">Điền từ</span>
        </button>
        <button
          onClick={() => setActiveTab("partB")}
          className={`p-3 rounded-full flex flex-col items-center transition-colors ${
            activeTab === "partB"
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <span className="font-black text-xs">B</span>
          <span className="text-[10px] font-bold mt-1">Chọn ý</span>
        </button>
        <button
          onClick={() => setActiveTab("partC")}
          className={`p-3 rounded-full flex flex-col items-center transition-colors ${
            activeTab === "partC"
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <span className="font-black text-xs">C</span>
          <span className="text-[10px] font-bold mt-1">Viết câu</span>
        </button>
        <div className="w-[1px] h-8 bg-pink-50" />
        <button
          onClick={() => setActiveTab("shop")}
          className={`p-3 rounded-full flex flex-col items-center transition-colors ${
            activeTab === "shop"
              ? "bg-pink-100 text-pink-600"
              : "text-gray-400 hover:text-pink-400"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Cửa hàng</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
