package io.pivotal.bootstrap.restaurant.services;

import io.pivotal.bootstrap.restaurant.Menu;
import io.pivotal.bootstrap.restaurant.MenuItem;
import org.springframework.stereotype.Service;

import static java.util.Arrays.asList;

@Service
public class MenusService {

    public Menu getMenu(){
        return new Menu(asList(new MenuItem("apples")));
    }
}
