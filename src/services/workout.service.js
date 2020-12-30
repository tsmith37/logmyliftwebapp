import http from "../http-common";

class WorkoutDataService {
	getAll(description='', sortBy='createdAt', sortDir='DESC') {
		return http.get(`/workout?description=${description}&sortBy=${sortBy}&sortDir=${sortDir}`);
	}

	get(id) {
		return http.get(`/workout/${id}`);
	}

	create(data) {
		return http.post("/workout", data);
	}

	update(id, data) {
		return http.put(`/workout`, data);
	}

	delete(id) {
		return http.delete(`/workout/${id}`);
	}

	findByDescription(description) {
		return http.get(`/workout?description=${description}`)
	}

	findMostRecent() {
		return http.get(`/workout/get/mostRecent`)
	}
}

export default new WorkoutDataService();
