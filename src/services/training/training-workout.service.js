import http from "../../http-common";

class TrainingWorkoutDataService {
	getAll() {
		return http.get("/training/workout");
	}

	get(id) {
		return http.get(`/training/workout/${id}`);
	}

	create(data) {
		return http.post("/training/workout", data);
	}

	update(id, data) {
		return http.put(`/training/workout`, data);
	}

	delete(id) {
		return http.delete(`/training/workout/${id}`);
	}

	findByProgramId(programId, name = '', week = '') {
		return http.get(`/training/workout?programId=${programId}&name=${name}&week=${week}`);
	}
}

export default new TrainingWorkoutDataService();
