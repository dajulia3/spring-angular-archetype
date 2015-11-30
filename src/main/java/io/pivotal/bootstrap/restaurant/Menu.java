package io.pivotal.bootstrap.restaurant;

import org.cloudfoundry.client.lib.org.codehaus.jackson.annotate.JsonCreator;
import org.cloudfoundry.client.lib.org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class Menu {
    private final List<MenuItem> items;

    @JsonCreator
    public Menu(@JsonProperty("items") List<MenuItem> items) {
        this.items = items;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Menu menu = (Menu) o;

        return !(items != null ? !items.equals(menu.items) : menu.items != null);

    }

    @Override
    public int hashCode() {
        return items != null ? items.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Menu{" +
                "items=" + items +
                '}';
    }
}
