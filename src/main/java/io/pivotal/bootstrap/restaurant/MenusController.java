package io.pivotal.bootstrap.restaurant;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import static java.util.Arrays.asList;

@Controller
public class MenusController {

    @RequestMapping("/menu")
    @ResponseBody
    public GetMenuResponse getMenu() {
        return new GetMenuResponse(new Menu(asList(new MenuItem("apples"))));
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
