package io.pivotal.bootstrap.restaurant;

import org.junit.Test;

import java.util.Collections;

import static java.util.Arrays.asList;
import static org.junit.Assert.*;

public class MenuTest {

    @Test
    public void equals() {
        Menu emptyMenu = new Menu(Collections.<MenuItem>emptyList());
        Menu nullMenu = new Menu(null);
        Menu anotherEmptyMenu = new Menu(Collections.<MenuItem>emptyList());
        Menu nonEmptyMenu = new Menu(asList(new MenuItem("item")));
        Menu sameNonEmptyMenu = new Menu(asList(new MenuItem("item")));

        assertEquals(emptyMenu, anotherEmptyMenu);
        assertEquals(nonEmptyMenu, sameNonEmptyMenu);
        assertNotEquals(emptyMenu, nonEmptyMenu);
        assertNotEquals(emptyMenu, "some other object");
        assertNotEquals(emptyMenu, nullMenu);
        assertNotEquals(emptyMenu, null);
    }
}