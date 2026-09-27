/* ==========================================================================
   TaskFlow Pro — Application Logic
   Vanilla JavaScript (ES6+) · No frameworks · No dependencies
   Data is persisted to window.localStorage.
   ========================================================================== */

(() => {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Constants & DOM references                                          */
  /* ------------------------------------------------------------------ */

  const STORAGE_KEY = "taskflow-pro.tasks";
  const THEME_KEY = "taskflow-pro.theme";

  const dom = {
    form: document.getElementById("taskForm"),
    input: document.getElementById("taskInput"),
    inputError: document.getElementById("inputError"),
    list: document.getElementById("taskList"),
    emptyState: document.getElementById("emptyState"),
    emptyStateText: document.getElementById("emptyStateText"),
    search: document.getElementById("searchInput"),
    filterTabs: document.querySelectorAll(".filter-tab"),
    statTotal: document.getElementById("statTotal"),
    statActive: document.getElementById("statActive"),
    statCompleted: document.getElementById("statCompleted"),
    statPercent: document.getElementById("statPercent"),
    progressRing: document.getElementById("progressRing"),
    markAllBtn: document.getElementById("markAllBtn"),
    clearCompletedBtn: document.getElementById("clearCompletedBtn"),
    deleteAllBtn: document.getElementById("deleteAllBtn"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalTitle: document.getElementById("modalTitle"),
    modalMessage: document.getElementById("modalMessage"),
    modalConfirmBtn: document.getElementById("modalConfirmBtn"),
    modalCancelBtn: document.getElementById("modalCancelBtn"),
    toast: document.getElementById("toast"),
    themeToggle: document.getElementById("themeToggle"),
  };

  /* ------------------------------------------------------------------ */
  /* Application state                                                    */
  /* ------------------------------------------------------------------ */

  const state = {
    tasks: [],          // Array<{id, title, completed, createdAt, updatedAt}>
    filter: "all",       // 'all' | 'active' | 'completed'
    query: "",           // current search term
    editingId: null,     // id of the task currently being edited
  };

  /* ------------------------------------------------------------------ */
  /* Persistence (Local Storage)                                         */
  /* ------------------------------------------------------------------ */

  const storage = {
    load() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error("TaskFlow Pro: failed to read tasks from storage", err);
        return [];
      }
    },
    save(tasks) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        console.error("TaskFlow Pro: failed to save tasks to storage", err);
        showToast("Could not save — storage may be full.");
      }
    },
  };

  /* ------------------------------------------------------------------ */
  /* Utilities                                                            */
  /* ------------------------------------------------------------------ */

  const generateId = () =>
    `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));

  const formatTimestamp = (iso) => {
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (sameDay) return `Today · ${time}`;
    const sameYear = date.getFullYear() === now.getFullYear();
    const dateStr = date.toLocaleDateString([], {
      month: "short", day: "numeric", year: sameYear ? undefined : "numeric",
    });
    return `${dateStr} · ${time}`;
  };

  let toastTimer = null;
  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove("is-visible"), 2200);
  }

  /* ------------------------------------------------------------------ */
  /* Confirmation modal (Promise-based)                                   */
  /* ------------------------------------------------------------------ */

  function confirmAction({ title, message, confirmLabel = "Confirm" }) {
    return new Promise((resolve) => {
      dom.modalTitle.textContent = title;
      dom.modalMessage.textContent = message;
      dom.modalConfirmBtn.textContent = confirmLabel;
      dom.modalOverlay.hidden = false;
      dom.modalConfirmBtn.focus();

      const cleanup = (result) => {
        dom.modalOverlay.hidden = true;
        dom.modalConfirmBtn.removeEventListener("click", onConfirm);
        dom.modalCancelBtn.removeEventListener("click", onCancel);
        dom.modalOverlay.removeEventListener("click", onOverlay);
        document.removeEventListener("keydown", onKeydown);
        resolve(result);
      };
      const onConfirm = () => cleanup(true);
      const onCancel = () => cleanup(false);
      const onOverlay = (e) => { if (e.target === dom.modalOverlay) cleanup(false); };
      const onKeydown = (e) => { if (e.key === "Escape") cleanup(false); };

      dom.modalConfirmBtn.addEventListener("click", onConfirm);
      dom.modalCancelBtn.addEventListener("click", onCancel);
      dom.modalOverlay.addEventListener("click", onOverlay);
      document.addEventListener("keydown", onKeydown);
    });
  }

  /* ------------------------------------------------------------------ */
  /* CRUD operations                                                      */
  /* ------------------------------------------------------------------ */

  function addTask(rawTitle) {
    const title = rawTitle.trim();

    if (!title) {
      showInputError("Task can't be empty — type something first.");
      return false;
    }
    if (title.length > 120) {
      showInputError("Keep tasks under 120 characters.");
      return false;
    }

    const now = new Date().toISOString();
    state.tasks.unshift({
      id: generateId(),
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });

    persistAndRender();
    showToast("Task added");
    return true;
  }

  function toggleTask(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();
    persistAndRender();
  }

  function startEditing(id) {
    state.editingId = id;
    render();
  }

  function saveEdit(id, newTitle) {
    const title = newTitle.trim();
    if (!title) {
      showToast("Task can't be empty");
      return;
    }
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      task.title = title;
      task.updatedAt = new Date().toISOString();
    }
    state.editingId = null;
    persistAndRender();
    showToast("Task updated");
  }

  function cancelEdit() {
    state.editingId = null;
    render();
  }

  async function deleteTask(id) {
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;

    const ok = await confirmAction({
      title: "Delete this task?",
      message: `"${task.title}" will be permanently removed.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;

    animateRemoval(id, () => {
      state.tasks = state.tasks.filter((t) => t.id !== id);
      persistAndRender();
      showToast("Task deleted");
    });
  }

  async function clearCompleted() {
    const completedCount = state.tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast("No completed tasks to clear");
      return;
    }
    const ok = await confirmAction({
      title: "Clear completed tasks?",
      message: `${completedCount} completed task${completedCount === 1 ? "" : "s"} will be removed.`,
      confirmLabel: "Clear completed",
    });
    if (!ok) return;

    state.tasks = state.tasks.filter((t) => !t.completed);
    persistAndRender();
    showToast("Completed tasks cleared");
  }

  async function deleteAll() {
    if (state.tasks.length === 0) {
      showToast("Nothing to delete");
      return;
    }
    const ok = await confirmAction({
      title: "Delete all tasks?",
      message: `All ${state.tasks.length} tasks will be permanently removed.`,
      confirmLabel: "Delete all",
    });
    if (!ok) return;

    state.tasks = [];
    persistAndRender();
    showToast("All tasks deleted");
  }

  async function markAllCompleted() {
    const activeCount = state.tasks.filter((t) => !t.completed).length;
    if (activeCount === 0) {
      showToast("Everything is already completed");
      return;
    }
    const ok = await confirmAction({
      title: "Mark all tasks completed?",
      message: `${activeCount} active task${activeCount === 1 ? "" : "s"} will be marked as done.`,
      confirmLabel: "Mark all completed",
    });
    if (!ok) return;

    const now = new Date().toISOString();
    state.tasks.forEach((t) => { t.completed = true; t.updatedAt = now; });
    persistAndRender();
    showToast("All tasks marked completed");
  }

  function animateRemoval(id, afterRemove) {
    const el = dom.list.querySelector(`[data-id="${id}"]`);
    if (!el) return afterRemove();
    el.classList.add("is-removing");
    el.addEventListener("animationend", afterRemove, { once: true });
  }

  /* ------------------------------------------------------------------ */
  /* Input validation UI                                                  */
  /* ------------------------------------------------------------------ */

  let errorTimer = null;
  function showInputError(message) {
    dom.inputError.textContent = message;
    dom.inputError.classList.add("is-visible");
    dom.input.setAttribute("aria-invalid", "true");
    clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
      dom.inputError.classList.remove("is-visible");
      dom.input.removeAttribute("aria-invalid");
    }, 2600);
  }

  /* ------------------------------------------------------------------ */
  /* Derived data                                                         */
  /* ------------------------------------------------------------------ */

  function getVisibleTasks() {
    return state.tasks.filter((t) => {
      const matchesFilter =
        state.filter === "all" ||
        (state.filter === "active" && !t.completed) ||
        (state.filter === "completed" && t.completed);

      const matchesQuery =
        state.query.trim() === "" ||
        t.title.toLowerCase().includes(state.query.trim().toLowerCase());

      return matchesFilter && matchesQuery;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                            */
  /* ------------------------------------------------------------------ */

  function renderStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    dom.statTotal.textContent = total;
    dom.statActive.textContent = active;
    dom.statCompleted.textContent = completed;
    dom.statPercent.textContent = `${percent}%`;

    const circumference = 113.1; // 2 * PI * r(18)
    const offset = circumference - (percent / 100) * circumference;
    dom.progressRing.style.strokeDashoffset = String(offset);
  }

  function renderTaskItem(task) {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " is-completed" : ""}`;
    li.dataset.id = task.id;

    if (state.editingId === task.id) {
      li.innerHTML = `
        <span class="task-checkbox" aria-hidden="true" style="opacity:.35;pointer-events:none;"></span>
        <div class="task-body">
          <input type="text" class="task-edit-input" value="${escapeHtml(task.title)}" maxlength="120" aria-label="Edit task title" />
        </div>
        <div class="task-actions">
          <button class="icon-btn icon-btn--save" data-action="save" title="Save changes" aria-label="Save changes">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none"><path d="M4 12.5L9.5 18L20 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-btn icon-btn--cancel" data-action="cancel-edit" title="Cancel" aria-label="Cancel editing">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          </button>
        </div>
      `;
      return li;
    }

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" data-action="toggle" ${task.completed ? "checked" : ""} aria-label="Mark '${escapeHtml(task.title)}' as ${task.completed ? "active" : "completed"}" />
      <div class="task-body">
        <p class="task-title">${escapeHtml(task.title)}</p>
        <p class="task-meta">${task.completed ? "Completed" : "Added"} ${formatTimestamp(task.updatedAt)}</p>
      </div>
      <div class="task-actions">
        <button class="icon-btn" data-action="edit" title="Edit task" aria-label="Edit task">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
        </button>
        <button class="icon-btn icon-btn--danger" data-action="delete" title="Delete task" aria-label="Delete task">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;
    return li;
  }

  function render() {
    const visible = getVisibleTasks();

    dom.list.innerHTML = "";
    const fragment = document.createDocumentFragment();
    visible.forEach((task) => fragment.appendChild(renderTaskItem(task)));
    dom.list.appendChild(fragment);

    const noTasksAtAll = state.tasks.length === 0;
    const noResultsForFilter = state.tasks.length > 0 && visible.length === 0;

    dom.emptyState.classList.toggle("is-visible", noTasksAtAll || noResultsForFilter);
    if (noResultsForFilter) {
      dom.emptyStateText.textContent = state.query
        ? `No tasks match "${state.query}".`
        : "No tasks in this view.";
    } else {
      dom.emptyStateText.textContent = "No tasks yet. Add your first task above to get started.";
    }

    // Focus the edit input if a task just entered edit mode.
    if (state.editingId) {
      const input = dom.list.querySelector(
        `[data-id="${state.editingId}"] .task-edit-input`
      );
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }

    renderStats();
  }

  function persistAndRender() {
    storage.save(state.tasks);
    render();
  }

  /* ------------------------------------------------------------------ */
  /* Event delegation — task list                                        */
  /* ------------------------------------------------------------------ */

  dom.list.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const li = e.target.closest(".task-item");
    const id = li?.dataset.id;
    if (!id) return;

    const action = actionEl.dataset.action;
    if (action === "toggle") return; // handled by change event
    if (action === "edit") return startEditing(id);
    if (action === "delete") return deleteTask(id);
    if (action === "save") {
      const input = li.querySelector(".task-edit-input");
      return saveEdit(id, input.value);
    }
    if (action === "cancel-edit") return cancelEdit();
  });

  dom.list.addEventListener("change", (e) => {
    if (e.target.matches('[data-action="toggle"]')) {
      const li = e.target.closest(".task-item");
      if (li) toggleTask(li.dataset.id);
    }
  });

  dom.list.addEventListener("keydown", (e) => {
    if (!e.target.matches(".task-edit-input")) return;
    const li = e.target.closest(".task-item");
    const id = li?.dataset.id;
    if (e.key === "Enter") { e.preventDefault(); saveEdit(id, e.target.value); }
    if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
  });

  /* ------------------------------------------------------------------ */
  /* Event listeners — input, search, filters, bulk actions               */
  /* ------------------------------------------------------------------ */

  dom.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const added = addTask(dom.input.value);
    if (added) {
      dom.input.value = "";
      dom.input.focus();
    }
  });

  dom.search.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  dom.filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.filter = tab.dataset.filter;
      dom.filterTabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      render();
    });
  });

  dom.markAllBtn.addEventListener("click", markAllCompleted);
  dom.clearCompletedBtn.addEventListener("click", clearCompleted);
  dom.deleteAllBtn.addEventListener("click", deleteAll);

  /* ------------------------------------------------------------------ */
  /* Theme toggle                                                         */
  /* ------------------------------------------------------------------ */

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  dom.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    try { window.localStorage.setItem(THEME_KEY, next); } catch (err) { /* non-critical */ }
  });

  /* ------------------------------------------------------------------ */
  /* Initialization                                                       */
  /* ------------------------------------------------------------------ */

  function init() {
    let savedTheme = "dark";
    try { savedTheme = window.localStorage.getItem(THEME_KEY) || "dark"; } catch (err) { /* ignore */ }
    applyTheme(savedTheme);

    state.tasks = storage.load();
    render();
  }

  init();
})();
