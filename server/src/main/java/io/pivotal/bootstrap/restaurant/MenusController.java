package io.pivotal.bootstrap.restaurant;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.pivotal.bootstrap.restaurant.services.MenusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MenusController {

    private final MenusService menusService;

    @Autowired
    public MenusController(MenusService menusService) {
        this.menusService = menusService;
    }

    @RequestMapping("/menu")
    public GetMenuResponse getMenu() {
        return new GetMenuResponse(menusService.getMenu());
    }


    public static class GetMenuResponse {
        private final Menu menu;

        @JsonCreator
        public GetMenuResponse(@JsonProperty("menu") Menu menu) {
            this.menu = menu;
        }

        public Menu getMenu() {
            return menu;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            GetMenuResponse response = (GetMenuResponse) o;

            return !(menu != null ? !menu.equals(response.menu) : response.menu != null);
        }

        @Override
        public int hashCode() {
            return menu != null ? menu.hashCode() : 0;
        }

        @Override
        public String toString() {
            return "GetMenuResponse{" +
                    "menu=" + menu +
                    '}';
        }
    }

}
