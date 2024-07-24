import axios from 'axios'

export default class MovieAPI {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYmNkZGNlY2ZjZDU1YzlkNzI5NTYxOTc0ZjhmZTU0ZiIsIm5iZiI6MTcyMTc1Mjg0Mi42MzU3NzIsInN1YiI6IjY2OWZkYzIzYTcyZmU4MTFkOTUyZDA4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H5hjwjmxZHixdUnUoVCBxJ7mYxn2lShtogZKtuwJLLw`
      }
    })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

  async getData(page = 1) {
    try {
      const response = await this.axiosInstance.get(`/movie/popular?language=pt-BR&page=${page}`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }

  async getRandomPage() {
    const data = await this.getData(1)
    if (!data) {
      throw new Error('Failed to fetch data.')
    }
    const totalPages = Math.min(data.total_pages, 200)
    return this.getRandomInt(totalPages) + 1
  }
  async getRandomMovie() {
    try {
      const page = await this.getRandomPage()
      const data = await this.getData(page)
      if (!data) {
        throw new Error('Failed to fetch data.')
      }
      const movie = data.results[this.getRandomInt(data.results.length)]
      if (movie.overview == '') {
        return this.getRandomMovie()
      }
      return {
        original_title: movie.original_title,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path
      }
    } catch (error) {
      console.error('Error fetching movie:', error)
      return null
    }
  }
}
