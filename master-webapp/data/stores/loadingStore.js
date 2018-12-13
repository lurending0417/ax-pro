/**
 * 自增
 */

const clearTime = 30000

class LoadingStore {
    loading = 0

    cached = {}

    showLoading(id) {
        if (!process.browser) {
            return;
        }
        if (id)
            this.cached[id] = true;
        this.loading++;
        if (this.loading) {
            $.showIndicator();

            // 30 s clear
            if (this.ts) {
                clearTimeout(this.ts);
            }
            this.ts = setTimeout(() => {
                this.loading = 1;
                this.hideLoading();
            }, clearTime)
        }
    }

    hideLoading(id) {
        if (!process.browser) {
            return;
        }
        if (id) {
            if (!this.cached[id]) {
                return;
            }
            delete this.cached[id]
        }

        this.loading--;
        if (this.loading <= 0) {
            this.loading = 0;
            $.hideIndicator();

            clearTimeout(this.ts)
            this.ts = null;
        }
    }
}

export default new LoadingStore();    