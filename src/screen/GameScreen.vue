<template>
  <div class="body">
    <img :src="image" :class="status_image" />
    <article>
      <h1>Qual o nome do filme?</h1>
      <h2 v-if="isFinish" class="title">{{ movie.title }}</h2>
      <p class="overview">{{ movie.overview }}</p>
      <form class="game-form" @submit.prevent>
        <input type="text" id="movie-name" autocomplete="off" v-model="shot_movie_name" />
        <button @click="checkAnswer" :disabled="isFinish">Dar Palpite</button>
        <button @click="nextMovie">Próximo Filme</button>
      </form>
      <div class="points">
        <p>Acertos: {{ hits }} <br /></p>
        <p>Tentativas: {{ attempts }}</p>
      </div>
    </article>
  </div>
</template>

<style>
article {
  display: flex;
  flex-direction: column;
}
form {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
h1 {
  font-weight: bold;
  font-size: 30px;
  color: rgb(228, 228, 228);
  margin-bottom: 10px;
}
h2 {
  font-weight: bold;
  color: rgb(228, 228, 228);
}
img {
  width: 80%;
  height: 550px;
  box-shadow: 2px 2px 8px 1px white;
  margin-bottom: 18px;
  transition:
    filter 0.8s ease,
    height 0.8s ease,
    margin 0.8s ease;
}

input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid white;
  color: white;
  font-size: large;
}

button {
  background-color: rgb(228, 228, 228);
  border: none;
  height: 30px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 15px;
  box-shadow: 5px 5px black;
  transition: box-shadow 0.8s ease;
}

button:hover {
  cursor: pointer;
  box-shadow: 2px 2px black;
}

input:focus {
  outline: none;
}

.body {
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.points {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.hidden {
  filter: blur(10px);
  margin-bottom: 36px;
}

.overview {
  height: 65%;
  width: 100%;
  text-align: justify;
  overflow-y: scroll;
}

.overview::-webkit-scrollbar {
  display: none;
}

@media (max-width: 600px) {
  .body {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }

  img {
    margin: 5px auto;
  }
  button {
    margin: 10px 0;
  }

  .title {
    margin: 10px 0;
  }
}
</style>

<script>
import MovieAPI from '../connection/MovieAPI.js'
export default {
  data() {
    return {
      isFinish: false,
      status_image: 'hidden',
      shot_movie_name: '',
      attempts: 5,
      hits: 0,
      image: '',
      movie: {
        original_title: '',
        title: '',
        overview: '',
        poster_path: ''
      }
    }
  },
  async created() {
    await this.getMovie()
  },

  watch: {
    attempts(newValue) {
      if (newValue === 0) {
        this.showName()
      }
    }
  },

  methods: {
    checkAnswer() {
      if (
        this.shot_movie_name.toUpperCase() != this.movie.title.toUpperCase() &&
        this.shot_movie_name.toUpperCase() != this.movie.original_title.toUpperCase()
      ) {
        this.attempts--
      } else {
        this.status_image = 'show'
        this.hits++
      }
    },

    showName() {
      this.isFinish = true
      this.status_image = 'show'
    },

    async getMovie() {
      let movieAPI = new MovieAPI()
      const randomMovie = await movieAPI.getRandomMovie()
      this.movie = randomMovie
      this.status_image = 'hidden'
      this.image = 'https://image.tmdb.org/t/p/w500' + this.movie.poster_path
      console.log(this.movie.title)
    },

    async nextMovie() {
      this.status_image = 'hidden'
      this.attempts = 5
      this.isFinish = false
      await this.getMovie()
    }
  }
}
</script>
