import http from "../http-common";

class LiftDataService {
	getAll() {
		return http.get("/lift");
	}

	get(id) {
		return http.get(`/lift/${id}`);
	}

	create(data) {
		return http.post("/lift", data);
	}

	update(id, data) {
		return http.put(`/lift`, data);
	}

	delete(id) {
		return http.delete(`/lift/${id}`);
	}

	findByWorkoutId(workoutId, sortBy='createdAt', sortDir='DESC') {
		return http.get(`/lift?workoutId=${workoutId}&sortBy=${sortBy}&sortDir=${sortDir}`);
	}

	findByExerciseId(exerciseId, sortBy='createdAt', sortDir='DESC') {
		return http.get(`/lift?exerciseId=${exerciseId}&sortBy=${sortBy}&sortDir=${sortDir}`);
	}
}

export default new LiftDataService();
