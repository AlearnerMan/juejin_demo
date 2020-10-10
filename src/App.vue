<template>
  <div id="app">
    <!-- <my-header></my-header> -->
    <!-- <my-content></my-content> -->
    <section>
      <transition>
        <router-link to="/login">Go to Foo</router-link>
      </transition>
      <router-view />
    </section>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  methods: {},
  mounted() {}
};
</script>
