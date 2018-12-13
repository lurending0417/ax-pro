<template>
    <div>
        <div class="content">
            test
        </div>
    </div>
</template>

<style>
    .content{
        background-color:#f7ae5c;
        min-width: 100px;
        max-width: 300px;
        border-radius: 5px;
        padding: 10px;
        position: relative;
        color: #fff;
    }
    .content::before{
        content: '';
        position: absolute;
        bottom:-14px;
        border-bottom: 7px solid transparent;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #f7ae5c;
    }
</style>
