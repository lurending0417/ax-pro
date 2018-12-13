<template>
    <div class="crumbs-wrapper">
        <ol class="breadcrumb">
            <li><a href="javascript:;">{{ navView.rootName }}</a></li>
            <li><router-link :to="{ path: navView.pathname }"><strong>{{ navView.name }}</strong></router-link></li>
        </ol>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        props: ['path', 'authorizedPages'],
        data() {
            return {
                navView: {},
                nav: []
            }
        },
        methods: {
            ...mapMutations('auth', {
                updatePathname: 'updatePathname'
            }),
            fillNavView() {
                this.updatePathname();
                if (this.authorizedPages.crumbs) {
                    this.navView = this.authorizedPages.crumbs.find(auth => auth.pathname === this.path);
                }
            }
        },
        beforeMount() {
            this.fillNavView();
        }
    };
</script>

<style>
    .crumbs-wrapper {
        margin-bottom: 20px;
    }
</style>
