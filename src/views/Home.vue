<template>
  <div class="home">
    <StarRating :rating="4.5">
    </StarRating>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeComponent from "@/components/HomeComponent.vue";

export default {
  name: "home",
  components: {
    HomeComponent
  }
};
</script>
