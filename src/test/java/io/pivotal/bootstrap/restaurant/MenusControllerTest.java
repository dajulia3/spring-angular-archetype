package io.pivotal.bootstrap.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static java.util.Arrays.asList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MenusControllerTest {

    private MockMvc mockMvc;

    @Before
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(new MenusController()).build();
    }

    @Test
    public void getMenu() throws Exception {
        Menu expectedMenu = new Menu(asList(new MenuItem("apples")));
        MenusController.GetMenuResponse expectedResponse = new MenusController.GetMenuResponse(expectedMenu);

        MvcResult mvcResult = mockMvc.perform(get("/menu").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn();
        MenusController.GetMenuResponse response = new ObjectMapper().readValue(mvcResult.getResponse().getContentAsString(), MenusController.GetMenuResponse.class);
        assertThat(response, equalTo(expectedResponse));
    }


    @Test
    public void getMenuResponseEquals() {
        Menu menu = new Menu(Collections.<MenuItem>emptyList());
        MenusController.GetMenuResponse response = new MenusController.GetMenuResponse(menu);
        MenusController.GetMenuResponse sameResponse = new MenusController.GetMenuResponse(menu);
        MenusController.GetMenuResponse differentResponse = new MenusController.GetMenuResponse(null);

        assertEquals(response, sameResponse);
        assertNotEquals(response, differentResponse);
        assertNotEquals(response, "some other object");
        assertNotEquals(response, null);
    }
}
