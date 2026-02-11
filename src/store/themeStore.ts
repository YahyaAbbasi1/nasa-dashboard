// store/themeStore.ts
import { create } from "zustand";
import { theme } from "antd";

type ThemeMode = "light" | "dark";
type LayoutType = "side" | "top" | "mix";
type ContentWidth = "Fluid" | "Fixed";
type NavTheme = "light" | "dark" | "realDark";
type MenuTheme = "light" | "dark";

interface ThemeStore {
    hideSidebar: boolean;
  hideHeader: boolean;
  // Theme settings
  mode: ThemeMode;
  
  primaryColor: string;
  borderRadius: number;
  colorWeak: boolean;
  
  // Layout settings
  layout: LayoutType;
  contentWidth: ContentWidth;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  autoHideHeader: boolean;
  
  // Menu settings
  compact: boolean;
  splitMenus: boolean;
  navTheme: NavTheme;
  menuTheme: MenuTheme;
  
  // Page settings
  multiTab: boolean;
  footerRender: boolean;
  
  // Actions
  toggleMode: () => void;
  setPrimaryColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  toggleColorWeak: () => void;
    toggleHideSidebar: () => void;
  toggleHideHeader: () => void;
  setLayout: (layout: LayoutType) => void;
  setContentWidth: (width: ContentWidth) => void;
  toggleFixedHeader: () => void;
  toggleFixedSidebar: () => void;
  toggleAutoHideHeader: () => void;
  toggleCompact: () => void;
  toggleSplitMenus: () => void;
  setNavTheme: (theme: NavTheme) => void;
  toggleMenuTheme: () => void;
  toggleMultiTab: () => void;
  toggleFooterRender: () => void;
  resetToDefault: () => void;
}

const getDefaultThemeValues = (): Omit<ThemeStore, 'resetToDefault'> => ({
  // Theme settings
  primaryColor: "#1677ff",
  borderRadius: 6,
  mode: "light",
  colorWeak: false,

  // Layout settings
  layout: "mix",
  contentWidth: "Fluid",
  fixedHeader: false,
  fixSiderbar: false,
  autoHideHeader: false,
  hideSidebar: false,
  hideHeader: false,

  // Menu settings
  compact: false,
  splitMenus: false,
  navTheme: "light",
  menuTheme: "dark",

  // Page settings
  multiTab: false,
  footerRender: false,

  // Action stubs - must match ALL actions from interface except resetToDefault
  toggleMode: () => {},
  setPrimaryColor: () => {},
  setBorderRadius: () => {},
  toggleColorWeak: () => {},
  setLayout: () => {},
  setContentWidth: () => {},
  toggleFixedHeader: () => {},
  toggleFixedSidebar: () => {},
  toggleAutoHideHeader: () => {},
  toggleCompact: () => {},
  toggleSplitMenus: () => {},
  setNavTheme: () => {},
  toggleMenuTheme: () => {},
  toggleMultiTab: () => {},
  toggleFooterRender: () => {},
  toggleHideSidebar: () => {}, // Now included in interface
  toggleHideHeader: () => {}  // Now included in interface
});

const defaultSettings = {
  primaryColor: localStorage.getItem("primaryColor") || "#1677ff",
  borderRadius: parseInt(localStorage.getItem("borderRadius") || "6", 10),
  compact: localStorage.getItem("compact") === "true",
  mode: (localStorage.getItem("theme") as ThemeMode) || "light",
  layout: (localStorage.getItem("layout") as LayoutType) || "mix",
   hideSidebar: localStorage.getItem("hideSidebar") === "true",
  hideHeader: localStorage.getItem("hideHeader") === "true",
  contentWidth: (localStorage.getItem("contentWidth") as ContentWidth) || "Fluid",
  navTheme: (localStorage.getItem("navTheme") as NavTheme) || "light",
  menuTheme: (localStorage.getItem("menuTheme") as MenuTheme) || "dark",
  fixedHeader: localStorage.getItem("fixedHeader") === "true",
  fixSiderbar: localStorage.getItem("fixSiderbar") === "true",
  autoHideHeader: localStorage.getItem("autoHideHeader") === "true",
  colorWeak: localStorage.getItem("colorWeak") === "true",
  splitMenus: localStorage.getItem("splitMenus") === "true",
  multiTab: localStorage.getItem("multiTab") === "true",
  footerRender: localStorage.getItem("footerRender") === "true",
};

const useThemeStore = create<ThemeStore>((set) => ({
  ...defaultSettings,

  // Theme actions
  toggleHideSidebar: () => set((state) => {
    const newValue = !state.hideSidebar;
    localStorage.setItem("hideSidebar", String(newValue));
    return { hideSidebar: newValue };
  }),

  toggleHideHeader: () => set((state) => {
    const newValue = !state.hideHeader;
    localStorage.setItem("hideHeader", String(newValue));
    return { hideHeader: newValue };
  }),

  toggleMode: () => set((state) => {
    const newMode = state.mode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
    return { mode: newMode };
  }),

  setPrimaryColor: (color) => {
    localStorage.setItem("primaryColor", color);
    document.documentElement.style.setProperty("--primary-color", color);
    return set({ primaryColor: color });
  },

  setBorderRadius: (radius) => {
    localStorage.setItem("borderRadius", radius.toString());
    return set({ borderRadius: radius });
  },

  toggleColorWeak: () => set((state) => {
    const newValue = !state.colorWeak;
    localStorage.setItem("colorWeak", newValue.toString());
    if (newValue) {
      document.body.classList.add("color-weak");
    } else {
      document.body.classList.remove("color-weak");
    }
    return { colorWeak: newValue };
  }),

  // Layout actions
  setLayout: (layout) => {
    localStorage.setItem("layout", layout);
    return set({ layout });
  },

  setContentWidth: (contentWidth) => {
    localStorage.setItem("contentWidth", contentWidth);
    return set({ contentWidth });
  },

  toggleFixedHeader: () => set((state) => {
    const newValue = !state.fixedHeader;
    localStorage.setItem("fixedHeader", newValue.toString());
    return { fixedHeader: newValue };
  }),

  toggleFixedSidebar: () => set((state) => {
    const newValue = !state.fixSiderbar;
    localStorage.setItem("fixSiderbar", newValue.toString());
    return { fixSiderbar: newValue };
  }),

  toggleAutoHideHeader: () => set((state) => {
    const newValue = !state.autoHideHeader;
    localStorage.setItem("autoHideHeader", newValue.toString());
    return { autoHideHeader: newValue };
  }),

  // Menu actions
  toggleCompact: () => set((state) => {
    const newValue = !state.compact;
    localStorage.setItem("compact", newValue.toString());
    return { compact: newValue };
  }),

  toggleSplitMenus: () => set((state) => {
    const newValue = !state.splitMenus;
    localStorage.setItem("splitMenus", newValue.toString());
    return { splitMenus: newValue };
  }),

  setNavTheme: (navTheme) => {
    localStorage.setItem("navTheme", navTheme);
    return set({ navTheme });
  },

  toggleMenuTheme: () => set((state) => {
    const newValue = state.menuTheme === "light" ? "dark" : "light";
    localStorage.setItem("menuTheme", newValue);
    return { menuTheme: newValue };
  }),

  // Page actions
  toggleMultiTab: () => set((state) => {
    const newValue = !state.multiTab;
    localStorage.setItem("multiTab", newValue.toString());
    return { multiTab: newValue };
  }),

  toggleFooterRender: () => set((state) => {
    const newValue = !state.footerRender;
    localStorage.setItem("footerRender", newValue.toString());
    return { footerRender: newValue };
  }),

  // Reset action
  resetToDefault: () => {
    const defaultValues = getDefaultThemeValues();
    
    Object.keys(defaultValues).forEach(key => {
      if (typeof defaultValues[key as keyof typeof defaultValues] !== 'function') {
        localStorage.removeItem(key);
      }
    });

    document.body.classList.remove("color-weak");
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.setProperty("--primary-color", "#1677ff");

    return set(state => ({
      ...state,
      primaryColor: "#1677ff",
      borderRadius: 6,
      compact: false,
      mode: "light",
      layout: "mix",
      contentWidth: "Fluid",
      navTheme: "light",
      menuTheme: "dark",
      fixedHeader: false,
      fixSiderbar: false,
      autoHideHeader: false,
      colorWeak: false,
      splitMenus: false,
      multiTab: false,
      footerRender: false
    }));
  },
}));

// Initialize theme on first load
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("theme") as ThemeMode || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  const savedColor = localStorage.getItem("primaryColor") || "#1677ff";
  document.documentElement.style.setProperty("--primary-color", savedColor);
  
  if (localStorage.getItem("colorWeak") === "true") {
    document.body.classList.add("color-weak");
  }
}

export { useThemeStore };