// 添加任务 但任务 按序列执行
export default class SingleTask {
  constructor() {
    this.tasks = [];
    this.__ts = null;
  }
  insert=(task) => {
    this.tasks.splice(0, 0, task);
  }
  push=(task) => {
    this.tasks.push(task);

    if (!this.__ts) {
      this.__ts = 1;
      setImmediate(() => {
        this.execute([...this.tasks]);
        this.tasks = [];
      })
    }
  }
  execute=async function (tasks) {
    let index = 0;
    const len = tasks.length;

    if (!len) {
      this.__ts = null;
      return
    }

    while (index < len) {
      try {
        await tasks[index++]();
      } catch (e) {
        console.error(e);
      }
    }

    this.__ts = null;
  }
}
