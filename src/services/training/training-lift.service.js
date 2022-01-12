import http from "../../http-common";

class TrainingLiftDataService {
	getAll() {
		return http.get("/training/lift");
	}

	get(id) {
		return http.get(`/training/lift/${id}`);
	}

	create(data) {
		return http.post("/training/lift", data);
	}

	update(data) {
		return http.put(`/training/lift`, data);
	}

	delete(id) {
		return http.delete(`/training/lift/${id}`);
	}

	findByWorkoutId(trainingWorkoutId) {
		return http.get(`/training/lift?trainingWorkoutId=${trainingWorkoutId}`);
	}
}

export default new TrainingLiftDataService();
