<template>
  <v-card class="mainDiv">
    <div class="headerDiv">
      <h1 class="display-2" style="max-width: 80%">
        {{subject.titlu}}
        <span>
          <v-btn @click="showDialog = !showDialog" round depressed outline color="primary" style="font-weight: 600">
            <v-icon left>mail</v-icon>
            E-mail rapoarte
          </v-btn>
        </span>
      </h1>
      <v-btn @click="exportData" class="exportBtn" color="primary" large>
        <v-icon left>cloud_download</v-icon>
        Exportare csv
      </v-btn>
      <br>
      <star-rating class="rating" :rating="generalRating"/>
    </div>
    <br>
    <div class="contentDiv">
      <h1><span style="font-weight: 500; color: hsl(0, 0%, 49%)">Recenzii disponibile: </span>{{noReviews}} </h1>

      <br>

      <v-select v-model="selectedItem" class="selectBox" :items="titles" placeholder="Selecteaza" solo>Curs</v-select>
      <span class="headline" style="margin-left: 1rem; font-weight: 600">
        Dată: <span class="selectedDate">{{selectedDate}}</span>
      </span>

      <br>
      <br>

      <v-data-table :headers="headers" :items="tableItems" class="elevation-1" hide-actions>
        <template slot="headers" slot-scope="props">
          <th v-for="header in props.headers" class="headerCell" :key="header.value">
            {{header.text}}
          </th>
        </template>
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.qc0 || props.item.qc0 }}</td>
          <td class="text-xs-center">{{ props.item.qc1 || props.item.ql1 }}</td>
          <td class="text-xs-center">{{ props.item.qc2 || props.item.ql2 }}</td>
          <td class="text-xs-center">{{ props.item.qc3 || props.item.ql3 }}</td>
          <td class="text-xs-left">
            <ul>
              <li class="comment" v-for="row in props.item.additionalComments" :key="row">
                {{row}}
              </li>
            </ul>
          </td>
        </template>
      </v-data-table>

      <br>

      <div style="text-align: right">
        <v-btn @click="exportTable" :disabled="headers == undefined || tableItems == undefined" outline large color="primary" style="margin-right: 0">
          <v-icon left>file_download</v-icon>
          Exportare tabel
        </v-btn>
      </div>
    </div>
    <mail-scheduler v-model="showDialog" />
  </v-card>
</template>

<script>
import FileSaver from "file-saver";
import Papa from "papaparse";
import { remove as removeDiacritics } from "diacritics";
import firebase from "firebase/app";
import StarRating from "@/components/StarRating.vue";
import MailScheduler from "@/components/MailScheduler.vue";

export default {
  components: {
    StarRating,
    MailScheduler
  },
  created: function() {
    firebase
      .database()
      .ref(`discipline/${this.$route.params.id}`)
      .on("value", snapshot => {
        this.subject = snapshot.val();
        this.loadQuestions();
        this.loadAnswers();
      });
  },
  computed: {
    selectedDate: function() {
      if (this.dates[this.selectedItem])
        return this.getDateTime(this.selectedItem);
      else return "N/A";
    },
    noReviews: function() {
      const number =
        Object.values(this.answers.cursuri)
          .map(v => v.length)
          .reduce((acc, cur) => acc + cur, 0) +
        Object.values(this.answers.laboratoare)
          .map(v => v.length)
          .reduce((acc, cur) => acc + cur, 0);
      return number;
    },
    generalRating: function() {
      const ratings = []
        .concat(...Object.values(this.answers.cursuri))
        .map(v => v.qc3.answer);
      +[]
        .concat(...Object.values(this.answers.laboratoare))
        .map(v => v.ql3.answer);
      return ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length || 0;
    },
    titles: function() {
      return [].concat(
        ...Object.keys(this.answers.cursuri),
        ...Object.keys(this.answers.laboratoare)
      );
    },
    headers: function() {
      if (this.selectedItem) {
        if (this.selectedItem.includes("Cursul")) {
          return Object.entries(this.qCourses)
            .map(([key, q]) => {
              return {
                text: q.title,
                value: key,
                sortable: false
              };
            })
            .concat({
              text: "Comentarii adiționale",
              value: "additionalComments",
              sortable: false
            });
        } else {
          return Object.entries(this.qLaboratories)
            .map(([key, q]) => {
              return {
                text: q.title,
                value: key,
                sortable: false
              };
            })
            .concat({
              text: "Comentarii adiționale",
              value: "additionalComments",
              sortable: false
            });
        }
      }
    },
    tableItems: function() {
      if (this.selectedItem) {
        return this.getTableItems(this.selectedItem);
      }
    },
    questions: function() {
      return { ...this.qCourses, ...this.qLaboratories };
    }
  },
  data: function() {
    return {
      subject: {},
      qCourses: {},
      qLaboratories: {},
      dates: {},
      answers: { cursuri: {}, laboratoare: {} },
      selectedItem: null,
      showDialog: false
    };
  },
  methods: {
    exportTable() {
      const csv = this.getCSVFromItems(this.tableItems);

      this.downloadData(
        csv,
        `${this.truncateString(this.subject.titlu)} - ${this.selectedItem}.csv`
      );
    },
    // Truncates the string into the shortest sequence of words with length
    // lower than `length`
    truncateString(str, length = 29) {
      return str.substring(0, length);
    },
    downloadData: function(data, fileName) {
      const blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
      });
      FileSaver.saveAs(blob, fileName);
    },
    exportData: function() {
      const results = this.titles.map(title => {
        let tempObj = {};
        tempObj["items"] = this.getTableItems(title);
        tempObj["title"] = title;
        tempObj["time"] = this.getDateTime(title);
        return tempObj;
      });
      const csvStrings = results.map(result => {
        const csvString =
          "\n============ " +
          result.title +
          " - " +
          result.time.replace(",", " ") +
          " ============\n" +
          this.getCSVFromItems(result.items) +
          "\n\n\n";
        return csvString;
      });
      this.downloadData(
        csvStrings.join(),
        `${this.truncateString(this.subject.titlu, 60)}.csv`
      );
    },
    getDateTime: function(selectedItem) {
      return new Date(this.dates[selectedItem]).toLocaleString("ro-RO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        timeZoneName: "short"
      });
    },
    getTableItems: function(selectedIndex) {
      // Get all the reviews for that course/laboratory
      const allReviews = Object.values(this.answers).reduce((acc, cur) => {
        return { ...cur, ...acc };
      }, {});

      return allReviews[selectedIndex].map(entry => {
        let additionalComments = [];
        return Object.assign(
          ...Object.entries(entry).map(([key, value]) => {
            const temp = {};

            // This is the additional comment
            if (value.answer == null) {
              additionalComments.push(value);
            } else if (value.answer === false) {
              temp[key] = "Nu";
              additionalComments.push(value.additionalComment);
            } else if (value.answer === true) {
              temp[key] = "Da";
              additionalComments.push(value.additionalComment);
            } else temp[key] = value.answer;

            const nonEmptyComments = additionalComments.filter(v => v != "");
            temp["additionalComments"] = nonEmptyComments;

            return temp;
          })
        );
      });
    },
    getCSVFromItems: function(items) {
      const toUnparse = items.map(item => {
        let tempObj = {};
        for (const key in item) {
          if (this.qCourses.hasOwnProperty(key)) {
            tempObj[removeDiacritics(this.qCourses[key].title)] = item[key];
          } else if (this.qLaboratories.hasOwnProperty(key)) {
            tempObj[removeDiacritics(this.qLaboratories[key].title)] =
              item[key];
          } else if (key == "additionalComments") {
            tempObj["Comentarii aditionale"] = item[key];
          }
        }
        return tempObj;
      });

      return Papa.unparse(toUnparse);
    },
    loadAnswers: function() {
      // Incarcam toate raspunsurile actuale
      firebase
        .database()
        .ref("answers")
        .on("value", snapshot => {
          // Prima data incarcam raspunsurile la cursuri
          snapshot.forEach(snap => {
            if (snap.key in this.subject.cursuri) {
              let answers = [];
              this.dates[
                this.subject.cursuri[snap.key].shortTitle
              ] = this.subject.cursuri[snap.key].dateStart;
              snap.forEach(answer => {
                answers.push(answer.val());
              });
              this.$set(
                this.answers.cursuri,
                this.subject.cursuri[snap.key].shortTitle,
                answers
              );
            }
          });
          // Apoi raspunsurile la laboratoare
          snapshot.forEach(snap => {
            if (snap.key in this.subject.laboratoare) {
              let answers = [];
              this.dates[
                this.subject.laboratoare[snap.key].shortTitle
              ] = this.subject.laboratoare[snap.key].dateStart;
              snap.forEach(answer => {
                answers.push(answer.val());
              });
              this.$set(
                this.answers.laboratoare,
                this.subject.laboratoare[snap.key].shortTitle,
                answers
              );
            }
          });
        });
    },
    loadQuestions: function() {
      firebase
        .database()
        .ref("questionsCourses")
        .on("value", snapshot => {
          this.qCourses = snapshot.val();
          // this.$forceUpdate();
        });
      firebase
        .database()
        .ref("questionsLaboratory")
        .on("value", snapshot => {
          this.qLaboratories = snapshot.val();
          // this.$forceUpdate();
        });
    }
  }
};
</script>

<style scoped>
.contentDiv {
  padding: 1rem;
  padding-top: 0rem;
}

.exportBtn {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
}

.display-3 {
  display: inline-block;
}

.headerDiv {
  padding: 1rem;
  background: hsl(220, 12%, 95%);
}

.headerCell {
  max-width: 20rem;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mainDiv {
  position: relative;
  text-align: left;
  margin: 2rem 15%;
}

.rating {
  margin-bottom: 1rem;
}

.selectBox {
  display: inline-block;
  width: 15rem;
}

.selectedDate {
  color: hsl(0, 0%, 49%);
  font-weight: 500;
}
</style>
