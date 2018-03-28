<template>
  <div class="mainContainer">
    <div class="headlineContainer">
      <div class="imageTitle">
        <img src="../assets/icon-96x96.png" style="margin-right: 1rem" alt="">
        <div class="display-3">Master SSEA</div>
      </div>
      <div class="headline" style="width: 100%; position: absolute; top: 4.5rem">Aplicație de administrare</div>
    </div>
    <div class="cardsContainer">
      <v-card v-for="(disciplina, key) in discipline" :key="key" class="disciplina" :to="`subjects/${key}`" hover>
        <v-card-media :src="disciplina.imageURL" height="15rem"></v-card-media>
        <div class="cardTitle" style="text-align: center">{{ disciplina.titlu }}</div>
      </v-card>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data: function() {
    return {
      discipline: {}
    };
  },
  created: function() {
    firebase
      .database()
      .ref("discipline")
      .on("value", snapshot => {
        this.discipline = snapshot.val();
      });
  }
};
</script>

<style scoped>
.disciplina {
  width: 30%;
  margin: 0.5rem;
}

.headlineContainer {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 3rem;
}

.imageTitle {
  display: flex;
}

.mainContainer {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cardsContainer {
  display: flex;
  flex-wrap: wrap;
  margin: auto 10%;
}

.cardTitle {
  padding: 1rem;
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
