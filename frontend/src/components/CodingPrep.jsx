import React, { useMemo, useState } from "react";
import "./CodingPrep.css";

const INITIAL_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: 3,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Array",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    id: 4,
    title: "Valid Anagram",
    difficulty: "Easy",
    topic: "Hash Map",
    link: "https://leetcode.com/problems/valid-anagram/",
  },
  {
    id: 5,
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    link: "https://leetcode.com/problems/binary-search/",
  },
  {
    id: 6,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    link: "https://leetcode.com/problems/reverse-linked-list/",
  },
  {
    id: 7,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Binary Tree",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
  },
  {
    id: 8,
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Hash Set",
    link: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    id: 9,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    topic: "Linked List",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
  },
  {
    id: 10,
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    id: 11,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Sliding Window",
    link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: 12,
    title: "3Sum",
    difficulty: "Medium",
    topic: "Two Pointer",
    link: "https://leetcode.com/problems/3sum/",
  },
  {
    id: 13,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Array",
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    id: 14,
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Hash Map",
    link: "https://leetcode.com/problems/group-anagrams/",
  },
  {
    id: 15,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    topic: "Hash Map",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
  },
  {
    id: 16,
    title: "Daily Temperatures",
    difficulty: "Medium",
    topic: "Monotonic Stack",
    link: "https://leetcode.com/problems/daily-temperatures/",
  },
  {
    id: 17,
    title: "Number of Islands",
    difficulty: "Medium",
    topic: "Graph",
    link: "https://leetcode.com/problems/number-of-islands/",
  },
  {
    id: 18,
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/coin-change/",
  },
  {
    id: 19,
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Design",
    link: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: 20,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    topic: "Two Pointer",
    link: "https://leetcode.com/problems/trapping-rain-water/",
  },
];

function CodingPrep() {
  const [solved, setSolved] = useState(() => {
    try {
      const saved = localStorage.getItem("jobly-coding-solved");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const toggleSolved = (id) => {
    setSolved((current) => {
      const updated = current.includes(id)
        ? current.filter((problemId) => problemId !== id)
        : [...current, id];

      localStorage.setItem(
        "jobly-coding-solved",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const filteredProblems = useMemo(() => {
    return INITIAL_PROBLEMS.filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.topic.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || problem.difficulty === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const solvedCount = solved.length;
  const totalCount = INITIAL_PROBLEMS.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round((solvedCount / totalCount) * 100);

  return (
    <section className="coding-section" id="coding-prep">
      {/* HEADER */}
      <div className="coding-section-header">
        <div>
          <div className="coding-eyebrow">
            05 / PREPARATION
          </div>

          <h2 className="coding-title">
            Get ready.
            <span>Get confident.</span>
          </h2>

          <p className="coding-description">
            Prepare for coding interviews by tracking your DSA
            practice and interview questions.
          </p>
        </div>

        <div className="coding-overall">
          <div className="coding-overall-number">
            {progress}%
          </div>

          <div className="coding-overall-label">
            READY
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="coding-main-progress">
        <div className="coding-main-progress-top">
          <strong>
            {solvedCount} / {totalCount}
          </strong>

          <span>Problems solved</span>
        </div>

        <div className="coding-main-progress-track">
          <div
            className="coding-main-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div className="coding-controls">
        <div className="coding-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search problems or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="coding-filters">
          {["All", "Easy", "Medium", "Hard"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* PROBLEM LIST */}
      <div className="coding-problem-list">
        {filteredProblems.map((problem, index) => {
          const isSolved = solved.includes(problem.id);

          return (
            <div
              className={`coding-problem ${
                isSolved ? "solved" : ""
              }`}
              key={problem.id}
            >
              <div className="coding-problem-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="coding-problem-main">
                <div className="coding-problem-title-row">
                  <h3>{problem.title}</h3>

                  <span
                    className={`difficulty ${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <div className="coding-problem-topic">
                  {problem.topic}
                </div>
              </div>

              <div className="coding-problem-actions">
                <a
                  href={problem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="coding-solve-link"
                >
                  Solve →
                </a>

                <button
                  className={`coding-done-button ${
                    isSolved ? "completed" : ""
                  }`}
                  onClick={() => toggleSolved(problem.id)}
                >
                  {isSolved ? "✓ Solved" : "Mark solved"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div className="coding-empty">
          No problems found.
        </div>
      )}
    </section>
  );
}

export default CodingPrep;