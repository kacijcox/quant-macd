// server/services/scheduler.ts

type ScheduledTask = {
    id: string;
    interval: number;
    callback: () => void | Promise<void>;
    timer?: NodeJS.Timeout;
};

export class Scheduler {
    private tasks: Map<string, ScheduledTask>;

    constructor() {
        this.tasks = new Map();
    }

    scheduleTask(id: string, callback: () => void | Promise<void>, intervalMs: number): void {
        if (this.tasks.has(id)) {
            this.cancelTask(id);
        }

        const timer = setInterval(async () => {
            try {
                await callback();
            } catch (error) {
                console.error(`Task ${id} failed:`, error);
            }
        }, intervalMs);

        this.tasks.set(id, { id, interval: intervalMs, callback, timer });
    }

    cancelTask(id: string): boolean {
        const task = this.tasks.get(id);
        if (task && task.timer) {
            clearInterval(task.timer);
            this.tasks.delete(id);
            return true;
        }
        return false;
    }

    cancelAll(): void {
        for (const task of this.tasks.values()) {
            if (task.timer) {
                clearInterval(task.timer);
            }
        }
        this.tasks.clear();
    }
}

export const scheduler = new Scheduler();