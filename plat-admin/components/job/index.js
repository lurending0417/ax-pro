import MyJob from "./Job";


const Job = {
    install: function (Vue) {
        Vue.component("Job", MyJob);
    }
};

export {
    Job
}
