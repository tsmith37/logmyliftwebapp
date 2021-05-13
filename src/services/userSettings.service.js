import http from "../http-common";

class UserSettingsDataService {
	get() {
		return http.get("/userSettings");
	}

	update(data) {
		return http.put("/userSettings", data);
	}
}

export default new UserSettingsDataService();
