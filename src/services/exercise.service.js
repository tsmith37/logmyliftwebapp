import http from "../http-common";

class ExerciseDataService {
	getAll() {
		return http.get("/exercise");
	}

	get(id) {
		return http.get(`/exercise/${id}`);
	}

	create(data) {
		return http.post("/exercise", data);
	}

	update(id, data) {
		return http.put(`/exercise`, data);
	}

	delete(id) {
		return http.delete(`/exercise/${id}`);
	}

	findByName(name) {
		return http.get(`/exercise?name=${name}`);
	}
}

export default new ExerciseDataService();
