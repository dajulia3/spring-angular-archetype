package io.pivotal.bootstrap.restaurant;

import org.junit.Test;

import static org.junit.Assert.*;

public class MenuItemTest {

    @Test
    public void equals() {
        MenuItem menuItem = new MenuItem("name");
        MenuItem sameMenuItem = new MenuItem("name");
        MenuItem anotherMenuItem = new MenuItem("another name");
        MenuItem nullMenuItem = new MenuItem(null);

        assertEquals(menuItem, sameMenuItem);
        assertNotEquals(menuItem, anotherMenuItem);
        assertNotEquals(menuItem, "some other object");
        assertNotEquals(menuItem, nullMenuItem);
        assertNotEquals(menuItem, null);
    }
}