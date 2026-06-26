export type Language = "en" | "zh";

let currentLang: Language = "zh";

export function setLanguage(lang: Language) {
  currentLang = lang;
  localStorage.setItem("gpkos_lang", lang);
  window.dispatchEvent(new Event("languageChanged"));
}

export function getLanguage(): Language {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("gpkos_lang") as Language) || "zh";
  }
  return currentLang;
}

const zhDict: Record<string, string> = {
  // Navigation
  "Home": "首页",
  "Blog": "博客",
  "Store": "商店",
  "Admin": "管理",
  "Login": "登录",
  "Sign Up": "注册",
  "Mailbox": "邮箱",
  "IDE": "终端",
  "Chat": "聊天",
  "Feedback": "反馈",
  
  // Commons
  "Submit": "提交",
  "Cancel": "取消",
  "Save": "保存",
  "Close": "关闭",
  "Search": "搜索...",
  "Loading...": "加载中...",
  "Error": "错误",
  "Success": "成功",
  
  // Specific Strings
  "rorygpkos virtual": "rorygpkos virtual",
  "Welcome to rorygpkos virtual": "欢迎来到 rorygpkos virtual",
  "Login to your account": "登录您的账户",
  "Create an account": "创建账户",
  "Log out": "登出",
  "Admin Dashboard": "管理员控制台",
  "Manage Users": "管理用户",
  "Settings": "系统设置",
  "Guest Visitor": "访客",
  
  // Nav
  "#home": "系统首页",
  "#work": "工作邮箱",
  "#rory-gpkos IDE": "核心终端 IDE",
  "msfs Sim": "飞行模拟器",
  "Remote Screen": "远程屏幕",
  "Video Stream": "监控流",
  "Friendship Album": "朋友圈相册",
  "Blogs CMS": "博客管理系统",
  "Mail & compiler Console": "邮件和终端控制台",
  "Owner Terminal Desk • Administrator: marvis_zhou": "系统机房终端桌 • 执勤管理员: 周子恒 (marvis_zhou)",

  // Home Main page content
  "Connect to the core secure mail server & macro infrastructure.": "连接到高安全的邮件服务与云宏架构节点。",
  "Start Operations": "启动管理",
  "Login Access": "核心系统登入",
  "Identity Creation": "创建身份",
  "Explore Local Simulator": "操作本地模拟器",

  // Sidebar
  "Navigation": "导航",
  "Dashboard": "仪表盘",
  "Messages": "消息中心",
  "Database": "云网数据",
  "Config Settings": "配置系统",

  // Sections
  "Feature Overview": "功能预览总览",
  "Security Gateway": "深信服安全网关",
  "Customization": "个性化定制",
  "Storage Allocations": "云存储配额使用率",

  // Labels
  "Full Name": "真实姓名",
  "Email / Contact ID": "邮箱账号 / 通讯标识",
  "Password": "终端密码",
  "Verify Profile Via": "身份验证核查渠道",
  "Register Secure Identity": "注册系统访客身份",
  "Already have an account?": "已经有通信账号了吗？",
  "Login here": "登录接入入口"
};

export function t(text: string): string {
  if (getLanguage() === "en") return text;
  return zhDict[text] || text;
}
