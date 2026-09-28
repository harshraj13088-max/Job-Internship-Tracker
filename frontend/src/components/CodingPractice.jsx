import { useEffect, useState } from "react";
import "./CodingPractice.css";

const CODING_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: 4,
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    link: "https://leetcode.com/problems/binary-search/",
  },
  {
    id: 5,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    link: "https://leetcode.com/problems/reverse-linked-list/",
  },
  {
    id: 6,
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/maximum-subarray/",
  },
  {
    id: 7,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 8,
    title: "3Sum",
    difficulty: "Medium",
    topic: "Two Pointer",
    link: "https://leetcode.com/problems/3sum/",
  },
  {
    id: 9,
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "HashMap",
    link: "https://leetcode.com/problems/group-anagrams/",
  },
  {
    id: 10,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    link: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    id: 11,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    topic: "Binary Tree",
    link: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
  },
  {
    id: 12,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Binary Tree",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  },
  {
    id: 13,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    topic: "Binary Tree",
    link: "https://leetcode.com/problems/validate-binary-search-tree/",
  },
  {
    id: 14,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "HashMap",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
  },
  {
    id: 15,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array",
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    id: 16,
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    id: 17,
    title: "Min Stack",
    difficulty: "Medium",
    topic: "Stack",
    link: "https://leetcode.com/problems/min-stack/",
  },
  {
    id: 18,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    id: 19,
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    topic: "Heap",
    link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
  },
  {
    id: 20,
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Design",
    link: "https://leetcode.com/problems/lru-cache/",
  },
];

function CodingPractice() {
  const [solved, setSolved] = useState(() => {
    const saved = localStorage.getItem("jobly-solved-problems");

    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    localStorage.setItem(
      "jobly-solved-problems",
      JSON.stringify(solved)
    );
  }, [solved]);

  const toggleSolved = (id) => {
    setSolved((current) =>
      current.includes(id)
        ? current.filter((problemId) => problemId !== id)
        : [...current, id]
    );
  };

  const filteredProblems = CODING_PROBLEMS.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.topic.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" ||
      problem.difficulty === difficulty;

    return matchesSearch && matchesDifficulty;
  });

  const progress = Math.round(
    (solved.length / CODING_PROBLEMS.length) * 100
  );

  return (
    <section className="coding-practice-page">

      <div className="coding-practice-header">

        <div>
          <span className="section-label">DSA / PRACTICE</span>

          <h1>
            Practice.
            <br />
            <em>Improve.</em>
          </h1>

          <p>
            Solve real interview problems and build your
            technical confidence step by step.
          </p>
        </div>

        <div className="coding-progress-card">

          <span>Your progress</span>

          <strong>{progress}%</strong>

          <div className="coding-progress-track">
            <div
              className="coding-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <small>
            {solved.length} / {CODING_PROBLEMS.length} solved
          </small>

        </div>

      </div>

      <div className="coding-controls">

        <input
          type="text"
          placeholder="Search problems or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="difficulty-buttons">

          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              className={difficulty === level ? "active" : ""}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}

        </div>

      </div>

      <div className="problem-list">

        {filteredProblems.map((problem, index) => {

          const isSolved = solved.includes(problem.id);

          return (
            <div
              className={`problem-row ${
                isSolved ? "problem-solved" : ""
              }`}
              key={problem.id}
            >

              <div className="problem-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="problem-main">

                <h3>{problem.title}</h3>

                <div className="problem-meta">

                  <span>{problem.topic}</span>

                  <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>

                </div>

              </div>

              <div className="problem-actions">

                <button
                  className={`solve-toggle ${
                    isSolved ? "solved" : ""
                  }`}
                  onClick={() => toggleSolved(problem.id)}
                >
                  {isSolved ? "✓ Solved" : "Mark Solved"}
                </button>

                <a
                  href={problem.link}
                  target="_blank"
                  rel="noreferrer"
                  className="solve-link"
                >
                  Solve →
                </a>

              </div>

            </div>
          );
        })}

      </div>

      {filteredProblems.length === 0 && (
        <div className="no-problems">
          No problems found.
        </div>
      )}

    </section>
  );
}

export default CodingPractice;