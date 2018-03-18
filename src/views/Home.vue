<template>
  <div class="home">
    <StarRating :rating="4.5">
    </StarRating>
  </div>
</template>

<script>
// @ is an alias to /src
import StarRating from "@/components/StarRating.vue";

export default {
  name: "home",
  components: {
    StarRating
  }
};
</script>
