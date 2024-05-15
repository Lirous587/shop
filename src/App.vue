<template>
  <router-view></router-view>
</template>

<style>
body{
  @apply bg-gray-100
}
 #nprogress .bar{
  background-color: white !important;
  height: 6px !important;
 }

 ::-webkit-scrollbar{
  height: 4px;
  width: 4px;
 }
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb,
::-webkit-scrollbar-track{
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
 