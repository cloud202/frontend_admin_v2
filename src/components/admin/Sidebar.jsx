import {  Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, List, ListIcon, ListItem, useBreakpointValue, useDisclosure } from '@chakra-ui/react'
import { CalendarIcon, ExternalLinkIcon, HamburgerIcon, PlusSquareIcon, ViewIcon } from '@chakra-ui/icons'
import React from 'react'
import { Link ,useLocation} from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useDisclosure();

      const sidebarItems = [
        { label: "New Project Template", route: "/admin/newproject",icon: PlusSquareIcon },
        { label: "View/Update Phases", route: "/admin/phase",icon: ViewIcon },
        { label: "View/Update Modules", route: "/admin/module",icon: ViewIcon },
        { label: "View/Update Task", route: "/admin/task",icon: ViewIcon },
        { label: "3rd Party Solution", route: "/admin/solution",icon: ExternalLinkIcon },
        { label: "List Customers", route: "/admin/customer",icon: CalendarIcon },
      ];

      const showSidebar = useBreakpointValue({ base: false, md: false,lg: true });

      if (showSidebar) {
        return (
          <List bg="#546269" position="fixed" minH="100vh" p="20px" alignItems="center" >
            {sidebarItems.map((item, index) => (
              <Link to={item.route} key={index}>
                <ListItem mb="15px" p="5px" color={location.pathname === item.route ? "#ffca39" : "#FFFFFF"} _hover={{borderRadius:'8px', backgroundColor: "#e6b01aa8" }}>
                  <ListIcon as={item.icon} />
                  {item.label}
                </ListItem>
              </Link>
            ))}
          </List>
        );
      } else {
        return (
          <>
          <Box position="fixed" top="6px" left="4px" zIndex={3}>
            <IconButton
              icon={<HamburgerIcon />}
              aria-label="Open Menu"
              onClick={onOpen}
              display={{ base: 'block', sm: 'block',md: 'block',lg: 'none' }}
              bg="#04373A"
              color="white"
              _hover={{ bg: "#D9A718" }}
              _active={{ bg: "#D9A718" }}
            />
            <Drawer isOpen={isOpen} onClose={onClose} placement="left">
                <DrawerOverlay>
                <DrawerContent bg="#546269">
                    <DrawerCloseButton color="white" />
                    <DrawerHeader color="white">Menu</DrawerHeader>
                    <DrawerBody>
                    <List spacing={3}>
                        {sidebarItems.map((item, index) => (
                        <Link to={item.route} key={index}>
                            <ListItem
                            mb="15px"
                            p="5px"
                            color={location.pathname === item.route ? "#ffca39" : "#FFFFFF"}
                            _hover={{borderRadius:'8px', backgroundColor: "#e6b01aa8" }}
                            >
                            <ListIcon as={item.icon} />
                            {item.label}
                            </ListItem>
                        </Link>
                        ))}
                    </List>
                    </DrawerBody>
                </DrawerContent>
                </DrawerOverlay>
      </Drawer>
      </Box>
          </>
        );
      }
}

export default Sidebar