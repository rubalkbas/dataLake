// Default theme settings configurations


export const ThemeSettingsConfig = {
  colorTheme: 'semi-dark', // light, semi-light, semi-dark, dark
  layout: {
    style: 'vertical', // style: 'vertical', horizontal,
    pattern: 'fixed' // fixed, boxed, static
  },
  menuColor: 'dark', // Vertical: [menu-dark, menu-light] , Horizontal: [navbar-dark, navbar-light]
  navigation: 'menu-accordation', // menu-collapsible, menu-accordation
  menu: 'expand', // collapse, expand
  header: 'fix', // fix, static
  footer: 'static', // fix, static
  customizer: 'off', // on,off
  headerIcons: {
    maximize: 'on', // on, off
    search: 'on', // on, off
    internationalization: 'on', // on, off
    notification: 'on', // on, off
    email: 'on' // on, off
  },
  brand: {
    brand_name: 'Prudential',
    logo: {
      type: 'internal', // internal, url
      value: 'assets/custom/images/iconoPrudential1.png' // recommended location for custom images
      // type:'url',
      // value:'http://evolvision.com/wp-content/uploads/2018/01/envelope4-green.png'
    },
  },
  defaultTitleSuffix: 'Prudential'
};
