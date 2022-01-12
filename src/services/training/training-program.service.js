import http from "../../http-common";

class TrainingProgramDataService {
	getAll() {
		return http.get("/training/program");
	}

	get(id) {
		return http.get(`/training/program/${id}`);
	}

	create(data) {
		return http.post("/training/program", data);
	}

	update(id, data) {
		return http.put(`/training/program`, data);
	}

	delete(id) {
		return http.delete(`/training/program/${id}`);
	}

	findByName(name) {
		return http.get(`/training/program?name=${name}`);
	}
}

export default new TrainingProgramDataService();
