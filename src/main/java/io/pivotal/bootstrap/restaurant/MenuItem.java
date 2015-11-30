package io.pivotal.bootstrap.restaurant;

import org.cloudfoundry.client.lib.org.codehaus.jackson.annotate.JsonCreator;
import org.cloudfoundry.client.lib.org.codehaus.jackson.annotate.JsonProperty;

public class MenuItem {
    private final String name;

    @JsonCreator
    public MenuItem(@JsonProperty("name") String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MenuItem menuItem = (MenuItem) o;

        return !(name != null ? !name.equals(menuItem.name) : menuItem.name != null);

    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "MenuItem{" +
                "name='" + name + '\'' +
                '}';
    }
}
