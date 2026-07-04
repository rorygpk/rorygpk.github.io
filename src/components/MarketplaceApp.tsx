import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  getDoc,
  setDoc,
  where,
  getDocs,
  limit
} from "firebase/firestore";
import {
  Search,
  Tag,
  Filter,
  ShoppingCart,
  DollarSign,
  Star,
  Zap,
  Upload,
  CreditCard,
  ArrowRightLeft,
  CheckCircle2,
  Trash2,
  Plus,
  Info,
  Sliders,
  User,
  Settings,
  ShieldCheck,
  Award,
  List,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  ShoppingBag,
  Coins,
  History,
  Unlock,
  CheckCircle
} from "lucide-react";

// Pre-populated items
const PRESET_MARKET_ITEMS = [
  {
    id: "preset-vpn-1",
    title: "GPKOS Global Dedicated Tunnel - VIP Enterprise Pass",
    description: "Ensure 10Gbps unlimited secure bandwidth across Tokyo, Hong Kong, SG, Silicon Valley nodes. Supports multi-device access (PCs, Phones, Tablets, Servers) with absolute zero packet loss and low latency guarantees. Purchase activates an instantaneous custom profile configuration download.",
    price: 49.00,
    condition: "Digital License",
    seller: "GPKOS_Network_Team",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "wechat", "paypal"],
    stock: 999,
    options: {
      "Subscription Term": ["1 Month ($49)", "1 Year (Save 20% +$390)"],
      "Assigned Tunnel IP": ["Shared Dynamic IP", "Dedicated Static Tunnel IP (+$20)"]
    },
    isDigital: true,
    downloadContent: "=== GPKOS VIP SECURE TUNNEL CONFIG ===\nhost: hk-vip.gpkos.net\nport: 5400\nauth-type: enterprise-mfa\nencryption: CHACHA20-POLY1305\nmtu: 1420\nmultihop-nodes: jp2, sg1\nbypass-lan: true\ndevice-slots: 10",
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-vpn-2",
    title: "Secure Assist Desktop Controller License",
    description: "Activates ultra high-fidelity remote screen control sessions with active mouse and keyboard coordination, hardware-accelerated color depth compression, and smart resolution scaling (up to 4K UHD). Lifetime license for all enterprise and personal clients.",
    price: 129.00,
    condition: "Digital License",
    seller: "Gpkos_Assist_Labs",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "wechat", "paypal"],
    stock: 999,
    options: {
      "License Scope": ["Personal (3 Devices)", "Enterprise (Unlimited Devices +$200)"]
    },
    isDigital: true,
    downloadContent: "=== GPKOS SECURE ASSIST LICENSE KEY ===\nLICENSE_HOLDER: zhou_marvis_gpkos\nSERIAL: GPK-REMOTE-9A1F-3B2C-7E4D\nACTIVATION_DATE: 2026-07-03\nREMOTE_DESKTOP_SUPPORT: ACTIVE\nSCREEN_FPS: 60",
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-1",
    title: "IBM ThinkPad 760ED (Vintage Retro Laptop)",
    description: "Classic IBM ThinkPad from 1996. Features Intel Pentium 133MHz, 16MB RAM, and beautiful active matrix screen. Perfect for retro collectors.",
    price: 349.99,
    condition: "Used - Excellent",
    seller: "RetroTech_Collector",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/IBM_Thinkpad_760ED.jpg",
    paymentMethods: ["card", "alipay", "wechat", "paypal"],
    stock: 5,
    options: {
      "Memory": ["16MB RAM (Original)", "32MB RAM (Max Upgraded)"],
      "OS": ["Windows 95", "MS-DOS 6.22"]
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-2",
    title: "Apple Watch Series 8 GPS - 45mm Midnight",
    description: "Midnight aluminum case with Midnight sport band. Excellent battery health, minor wear on the screen. Complete with original box and magnetic charger.",
    price: 249.00,
    condition: "Used - Excellent",
    seller: "TechFlip",
    imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "paypal"],
    stock: 12,
    options: {
      "Band Color": ["Midnight Sport", "Pride Edition", "Milanese Loop"],
      "Protection": ["None", "AppleCare+ (+$49)"]
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-3",
    title: "iPhone 13 Pro Max - 256GB Sierra Blue (Unlocked)",
    description: "Unlocked for any carrier. Sierra Blue, pristine condition. Back glass and screen are completely flawless. Battery health is at 89%.",
    price: 680.00,
    condition: "Used - Excellent",
    seller: "GadgetHub",
    imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "wechat", "paypal"],
    stock: 2,
    options: {
      "Storage": ["256GB", "512GB (+$120)"],
      "Battery Level": ["89% (Original)", "100% (New Battery +$40)"]
    },
    createdAt: new Date().toISOString()
  }
];

interface MerchantPaymentProfile {
  alipayAccount: string;
  alipayQR: string;
  wechatAccount: string;
  wechatQR: string;
  paypalEmail: string;
  cardDetails: string;
  balance: number;
}

export const MarketplaceApp = ({ currentUser }: { currentUser?: any }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"browse" | "sell" | "cart" | "checkout" | "success" | "merchant" | "admin-escrow">("browse");
  
  // Cart state
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("gpkos_market_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Items and Orders state
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Real-time items listener
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsData.length > 0 ? itemsData : PRESET_MARKET_ITEMS);
    });
    return () => unsubscribe();
  }, []);

  // Real-time orders listener
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "orders"), where("buyerId", "==", currentUser.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Merchant Balance Real-time
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = onSnapshot(doc(db, "users", currentUser.id), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setMerchantProfile(prev => ({
          ...prev,
          balance: userData.balance || 0
        }));
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const fetchItems = () => {}; // Replaced by onSnapshot
  const fetchOrders = () => {}; // Replaced by onSnapshot
  const saveOrders = () => {}; // Replaced by Firestore addDoc

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("请先登录账户再发布商品。");
      return;
    }
    if (!sellForm.title || !sellForm.price) {
      alert("请填写商品名称和价格！");
      return;
    }

    // Parse options input (e.g. "Color: Black, White\nSize: S, M, L")
    const parsedOptions: {[key: string]: string[]} = {};
    sellForm.optionsRaw.split("\n").forEach(line => {
      const pts = line.split(":");
      if (pts.length === 2) {
        const key = pts[0].trim();
        const vals = pts[1].split(",").map(v => v.trim());
        if (key && vals.length > 0) {
          parsedOptions[key] = vals;
        }
      }
    });

    const activeMethods = Object.keys(sellForm.paymentMethods).filter(k => (sellForm.paymentMethods as any)[k]);

    const finalImg = uploadedFileBase64 || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

    const newItem = {
      title: sellForm.title,
      description: sellForm.description || "暂无详细描述。",
      price: parseFloat(sellForm.price),
      condition: sellForm.condition,
      seller: currentUser.fullName || "Admin",
      sellerId: currentUser.id,
      imageUrl: finalImg,
      paymentMethods: activeMethods,
      stock: parseInt(sellForm.stock) || 5,
      options: parsedOptions,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "products"), newItem);
      alert("🎉 商品发布成功！已实时同步至 Firestore 全球节点。");
    } catch (e: any) {
      alert("发布失败: " + e.message);
    }
    // Reset listing form
    setSellForm({
      title: "",
      description: "",
      price: "",
      condition: "New with tags",
      stock: "5",
      paymentMethods: { alipay: true, wechat: true, paypal: true, card: true },
      optionsRaw: "Color: Black, White, Silver\nSize: Standard, Professional (+100)"
    });
    setUploadedFileName("");
    setUploadedFileBase64("");
    setView("browse");
  };

  const handleAddToCartFromPopup = () => {
    if (!optionPopupItem) return;
    
    // Add selected options metadata
    const itemInCart = {
      ...optionPopupItem,
      selectedOptions: { ...popupSelectedOptions },
      quantity: popupQuantity,
      totalPrice: optionPopupItem.price * popupQuantity
    };

    setCart(prev => [...prev, itemInCart]);
    alert(`🛒 已将 ${popupQuantity} 件「${optionPopupItem.title}」成功加入您的全球购物车！`);
    setOptionPopupItem(null);
  };

  const handleCheckoutSubmit = async (paymentMethod: "card" | "alipay" | "wechat" | "paypal") => {
    if (!currentUser) {
      alert("请先登录您的 GPKOS 虚拟主机会话再进行付款结算。");
      return;
    }
    if (cart.length === 0) return;
    
    setIsProcessingPayment(true);

    const computedTotal = cart.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0) + 15;

    // Create a new order in Firestore
    const newOrder = {
      items: [...cart],
      buyerId: currentUser.id,
      buyerName: currentUser.fullName,
      total: computedTotal,
      paymentMethod: paymentMethod,
      escrowStatus: "pending_verification",
      escrowStatusText: "系统已收账，等待价格验证 & 释放担保",
      sellerId: cart[0]?.sellerId || "admin",
      sellerName: cart[0]?.seller || "Zhou_Admin",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orders"), newOrder);
      setCart([]);
      setIsProcessingPayment(false);
      setView("success");
    } catch (e: any) {
      alert("Payment recording failed: " + e.message);
      setIsProcessingPayment(false);
    }
  };

  // Escrow Audit System Actions
  const handleVerifyPrice = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let calculatedSum = 0;
    order.items.forEach((it: any) => {
      calculatedSum += it.price * (it.quantity || 1);
    });
    calculatedSum += 15; 

    const isMatch = Math.abs(calculatedSum - order.total) < 0.05;

    if (isMatch) {
      await updateDoc(doc(db, "orders", orderId), {
        escrowStatus: "price_verified",
        escrowStatusText: "系统已确认价格无误，保障金锁仓托管中"
      });
      alert("✅ 系统确定价格无误！资金已锁定进入多签托管智能账户，等待转交商家。");
    } else {
      alert("⚠️ 校验失败！订单支付总额与系统商品价格明细不匹配，拒绝托管。");
    }
  };

  const handleReleaseFunds = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      // Release to merchant
      await updateDoc(doc(db, "orders", orderId), {
        escrowStatus: "completed",
        escrowStatusText: "已转交商家，资金已到账"
      });

      // Update merchant balance in Firestore
      const merchantRef = doc(db, "users", order.sellerId);
      const merchantDoc = await getDoc(merchantRef);
      const currentBalance = merchantDoc.exists() ? (merchantDoc.data().balance || 0) : 0;
      
      await updateDoc(merchantRef, {
        balance: currentBalance + order.total
      });

      alert(`💸 托管款 $${order.total.toFixed(2)} 已成功拨付给商家 [${order.sellerName}] 的账户余额中！`);
    } catch (e: any) {
      alert("Release failed: " + e.message);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("💾 商家收款方式及提现账户已保存至系统冷钱包。");
    setView("browse");
  };

  const handleWithdraw = () => {
    if (merchantProfile.balance <= 0) {
      alert("账户余额不足，无法发起提现。");
      return;
    }
    const sum = merchantProfile.balance;
    setMerchantProfile(prev => ({ ...prev, balance: 0 }));
    alert(`💸 提现成功！已将 $${sum.toFixed(2)} 提现至您指定的账户通道。`);
  };

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.seller.toLowerCase().includes(search.toLowerCase());

    const activeConditionFilters = Object.keys(filterConditions).filter((k) => filterConditions[k]);
    const matchCondition = activeConditionFilters.length === 0 || activeConditionFilters.includes(item.condition);

    const numericMin = parseFloat(minPrice);
    const numericMax = parseFloat(maxPrice);
    const matchMin = isNaN(numericMin) || item.price >= numericMin;
    const matchMax = isNaN(numericMax) || item.price <= numericMax;

    return matchSearch && matchCondition && matchMin && matchMax;
  });

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-900 border border-slate-300 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header section */}
      <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center gap-4 justify-between border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setView("browse")}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-lg tracking-tighter text-blue-900 flex items-center gap-1">
              RoryGpk<span className="text-blue-600">Marketplace</span>
            </span>
            <span className="text-[9px] block uppercase font-mono tracking-widest text-slate-400 font-bold -mt-1">
              Decentralized Escrow Exchange Network
            </span>
          </div>
        </div>

        {view === "browse" && (
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索任何全球在售宝贝、复古古玩、极客硬件 (如: ThinkPad, iPhone)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition text-xs font-semibold"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setView("sell")}
            className={`px-3 py-2 flex items-center gap-1 text-xs font-black rounded-lg transition-all ${view === "sell" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-transparent"}`}
          >
            <Upload className="w-4 h-4" /> 发布宝贝 (List)
          </button>
          
          <button
            onClick={() => setView("merchant")}
            className={`px-3 py-2 flex items-center gap-1 text-xs font-black rounded-lg transition-all ${view === "merchant" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-transparent"}`}
          >
            <Settings className="w-4 h-4" /> 商家收款设置 (My Shop)
          </button>

          <button
            onClick={() => setView("admin-escrow")}
            className={`px-3 py-2 flex items-center gap-1 text-xs font-black rounded-lg transition-all ${view === "admin-escrow" ? "bg-amber-50 text-amber-800 border border-amber-200" : "text-slate-600 hover:text-amber-600 hover:bg-slate-50 border border-transparent"}`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" /> 系统收账担保台 ({orders.filter(o => o.escrowStatus !== 'completed').length})
          </button>

          <button
            onClick={() => setView("cart")}
            className={`px-3 py-2 flex items-center gap-1 text-xs font-black rounded-lg transition-all relative ${view === "cart" ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-transparent"}`}
          >
            <ShoppingCart className="w-4 h-4" /> 购物车 ({cart.length})
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === "browse" && (
          <div className="flex-grow flex overflow-hidden">
            {/* Left sidebar filters */}
            <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 text-left overflow-y-auto hidden md:block shrink-0">
              <h3 className="font-bold text-xs text-slate-800 mb-4 border-b border-slate-200 pb-2 flex items-center gap-1">
                <Filter className="w-4 h-4 text-blue-500" /> 商品属性过滤
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">商品成色</span>
                  {Object.keys(filterConditions).map(cond => (
                    <label key={cond} className="flex items-center gap-2 text-xs text-slate-600 mb-1.5 cursor-pointer hover:text-slate-900 font-medium">
                      <input
                        type="checkbox"
                        checked={filterConditions[cond]}
                        onChange={() => setFilterConditions(prev => ({ ...prev, [cond]: !prev[cond] }))}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">价格区间</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-800 leading-relaxed">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 智能担保合约已启用
                    </div>
                    买家付款将先由系统进行校验锁仓（收账），核对订单各项费用及数量无误后，安全拨付至商家账户。
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace Items Grid */}
            <div className="flex-grow p-6 overflow-y-auto bg-slate-50 text-left">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Zap className="text-amber-500 w-4 h-4 animate-pulse" />
                  <span>集市精选货架 ({filteredItems.length} 件商品在售)</span>
                </h3>
              </div>

              {filteredItems.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-sm mx-auto mt-8">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">未找到宝贝</h4>
                  <p className="text-slate-400 text-xs mt-1">请尝试清除过滤条件。</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        {/* Image area */}
                        <div className="aspect-video bg-slate-50 border border-slate-100 rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
                          <img src={item.imageUrl} alt="item" className="max-h-full max-w-full object-cover" />
                          <span className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-bold px-2 py-0.5 rounded-full font-mono">
                            Qty: {item.stock}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 truncate">{item.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 h-8 mt-1 leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.paymentMethods?.map((m: string) => (
                            <span key={m} className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                              {m === 'alipay' ? '支付宝' : m === 'wechat' ? '微信' : m === 'paypal' ? 'PayPal' : '银行卡'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-4">
                        <span className="font-black text-lg text-slate-900">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => {
                            setOptionPopupItem(item);
                            // Set default selected options
                            const defaults: {[key: string]: string} = {};
                            if (item.options) {
                              Object.keys(item.options).forEach(k => {
                                defaults[k] = item.options[k][0];
                              });
                            }
                            setPopupSelectedOptions(defaults);
                            setPopupQuantity(1);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
                        >
                          立即抢购
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Option popup selector when user clicks Buy */}
        {optionPopupItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm">选择宝贝款式 & 选项</h4>
                <button onClick={() => setOptionPopupItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
              </div>

              <div className="flex gap-3">
                <img src={optionPopupItem.imageUrl} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                <div>
                  <h5 className="font-bold text-xs text-slate-800 line-clamp-1">{optionPopupItem.title}</h5>
                  <p className="font-black text-sm text-blue-600 mt-1">${optionPopupItem.price.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 font-mono">存量: {optionPopupItem.stock} 件可用</p>
                </div>
              </div>

              {/* Dynamic options selections */}
              {optionPopupItem.options && Object.keys(optionPopupItem.options).map(key => (
                <div key={key} className="space-y-1.5">
                  <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">{key}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {optionPopupItem.options[key].map((val: string) => (
                      <button
                        key={val}
                        onClick={() => setPopupSelectedOptions(prev => ({ ...prev, [key]: val }))}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition ${popupSelectedOptions[key] === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="space-y-1.5">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">购买数量 (Quantity)</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setPopupQuantity(Math.max(1, popupQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 font-bold border border-slate-200 flex items-center justify-center hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="font-bold font-mono text-xs">{popupQuantity}</span>
                  <button 
                    onClick={() => setPopupQuantity(Math.min(optionPopupItem.stock || 5, popupQuantity + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 font-bold border border-slate-200 flex items-center justify-center hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setOptionPopupItem(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  取消
                </button>
                <button
                  onClick={handleAddToCartFromPopup}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-100"
                >
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: List a product */}
        {view === "sell" && (
          <div className="flex-grow bg-slate-50 p-6 overflow-y-auto text-left">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <Upload className="text-blue-500 w-5 h-5" /> 发布新的产品到全球集市
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">商品将实时添加到分布式数据库，并支持高安全性托管到账服务。</p>
              </div>

              <form onSubmit={handleList} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">商品名称 *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 珍藏 IBM ThinkPad X220 键盘"
                      value={sellForm.title}
                      onChange={e => setSellForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">宝贝定价 ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={sellForm.price}
                      onChange={e => setSellForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">发布数量/库存 *</label>
                    <input
                      type="number"
                      required
                      value={sellForm.stock}
                      onChange={e => setSellForm(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">成色成色 *</label>
                    <select
                      value={sellForm.condition}
                      onChange={e => setSellForm(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="New with tags">New with tags (全新未拆封)</option>
                      <option value="Used - Excellent">Used - Excellent (充新二手)</option>
                      <option value="Used - Good">Used - Good (良好二手)</option>
                      <option value="For parts or not working">For parts or not working (报废/零件机)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">商品介绍/简介 *</label>
                  <textarea
                    rows={3}
                    placeholder="请输入商品的详细成色描述，规格，以及发货说明等..."
                    value={sellForm.description}
                    onChange={e => setSellForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none resize-none"
                  />
                </div>

                {/* Options Builder */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                    定制选项配置 (Options - 按行配置)
                  </label>
                  <textarea
                    rows={2}
                    value={sellForm.optionsRaw}
                    onChange={e => setSellForm(prev => ({ ...prev, optionsRaw: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none font-mono"
                  />
                </div>

                {/* Payment selection support */}
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                    支持的收款通道 (Payment Channels)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.keys(sellForm.paymentMethods).map(method => (
                      <label key={method} className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition text-xs font-bold text-slate-700 capitalize">
                        <input
                          type="checkbox"
                          checked={(sellForm.paymentMethods as any)[method]}
                          onChange={() => {
                            setSellForm(prev => ({
                              ...prev,
                              paymentMethods: {
                                ...prev.paymentMethods,
                                [method]: !(prev.paymentMethods as any)[method]
                              }
                            }));
                          }}
                          className="rounded text-blue-600 border-slate-300"
                        />
                        <span>{method === 'alipay' ? '支付宝' : method === 'wechat' ? '微信支付' : method === 'paypal' ? 'PayPal' : '信用卡'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">商品图展示 (Image Dropzone)</label>
                  <label className="block border border-dashed border-slate-300 p-5 rounded-2xl text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                    <span className="text-xs text-slate-500 block font-bold">
                      {uploadedFileName ? `📸 媒体图已就绪: ${uploadedFileName}` : "拖拽或点击上传宝贝实物照片"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          const reader = new FileReader();
                          reader.onload = re => setUploadedFileBase64(re.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setView("browse")} className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">取消</button>
                  <button type="submit" className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-100">发布到集市</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: Merchant payee set up */}
        {view === "merchant" && (
          <div className="flex-grow bg-slate-50 p-6 overflow-y-auto text-left">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                    <Settings className="text-blue-500 w-5 h-5" /> 商家收款配置与账单包
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">在此配置您的收款二维码或提现目标。买家通过该通道支付，系统多签确认价格无误后划拨。</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-black block">账户余额 (Balance)</span>
                  <span className="font-mono font-black text-lg text-blue-600">${merchantProfile.balance.toFixed(2)}</span>
                  <button onClick={handleWithdraw} className="block mt-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition ml-auto">提现到账</button>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">支付宝收款账号</label>
                    <input
                      type="text"
                      placeholder="e.g. pay@myalipay.com"
                      value={merchantProfile.alipayAccount}
                      onChange={e => setMerchantProfile(prev => ({ ...prev, alipayAccount: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">微信收款识别账号</label>
                    <input
                      type="text"
                      placeholder="e.g. wx_payee_id"
                      value={merchantProfile.wechatAccount}
                      onChange={e => setMerchantProfile(prev => ({ ...prev, wechatAccount: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">PayPal 商家邮箱 (PayPal Email)</label>
                    <input
                      type="email"
                      placeholder="e.g. seller-payout@paypal.com"
                      value={merchantProfile.paypalEmail}
                      onChange={e => setMerchantProfile(prev => ({ ...prev, paypalEmail: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">信用卡/借记卡商户结算 ID</label>
                    <input
                      type="text"
                      placeholder="e.g. CARD-MERCH-882172"
                      value={merchantProfile.cardDetails}
                      onChange={e => setMerchantProfile(prev => ({ ...prev, cardDetails: e.target.value }))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button type="button" onClick={() => setView("browse")} className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition">取消</button>
                  <button type="submit" className="flex-grow py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition">保存收款设置</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: Admin Escrow Audit Deck */}
        {view === "admin-escrow" && (
          <div className="flex-grow bg-slate-50 p-6 overflow-y-auto text-left">
            <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                  <ShieldCheck className="text-amber-500 w-5 h-5 animate-pulse" /> 系统多签收账与安全托管台 (System Escrow Desk)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  所有买家付出的担保资金均在系统冷钱包内进行托管审核。管理员点击价格校验后通过智能节点划拨划账给商家。
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400">目前没有任何系统托管订单。</div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    return (
                      <div key={order.id} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50 hover:bg-slate-100/50 transition">
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2.5 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-700">{order.id}</span>
                            <span className="text-slate-400">买家: <strong className="text-slate-700">@{order.buyer}</strong></span>
                            <span className="text-slate-400">卖家: <strong className="text-slate-700">@{order.seller}</strong></span>
                          </div>
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                              order.escrowStatus === 'completed' ? 'bg-green-100 text-green-700' :
                              order.escrowStatus === 'price_verified' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700 animate-pulse'
                            }`}>
                              {order.escrowStatusText}
                            </span>
                          </div>
                        </div>

                        {/* Order Items description */}
                        <div className="space-y-1.5 pl-3 border-l-2 border-slate-200">
                          {order.items?.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="font-medium text-slate-700">
                                {it.title} <span className="text-slate-400">x{it.quantity || 1}</span>
                              </span>
                              <span className="font-mono text-slate-500">${it.price.toFixed(2)} / ea</span>
                            </div>
                          ))}
                        </div>

                        {/* Escrow totals & actions */}
                        <div className="flex flex-wrap justify-between items-center pt-2.5 border-t border-slate-200 gap-3">
                          <div className="text-xs">
                            <span className="text-slate-400">担保总额:</span>
                            <span className="font-black text-slate-900 ml-1.5 text-sm">${order.total.toFixed(2)}</span>
                            <span className="text-slate-400 text-[10px] ml-2"> (包含 $15.00 系统理赔担保费)</span>
                          </div>

                          <div className="flex gap-2">
                            {order.escrowStatus === 'pending_verification' && (
                              <button
                                onClick={() => handleVerifyPrice(order.id)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition"
                              >
                                确定价格无误 (Verify Price)
                              </button>
                            )}
                            {order.escrowStatus === 'price_verified' && (
                              <button
                                onClick={() => handleReleaseFunds(order.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow"
                              >
                                安全转交商家 (Release Funds)
                              </button>
                            )}
                            {order.escrowStatus === 'completed' && (
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" /> 托管已划拨
                                </span>
                                {order.items?.some((it: any) => it.isDigital) && (
                                  <button
                                    onClick={() => {
                                      const digitalItem = order.items.find((it: any) => it.isDigital);
                                      if (digitalItem) {
                                        const element = document.createElement("a");
                                        const file = new Blob([digitalItem.downloadContent || "GPKOS SECURE PROFILE"], { type: 'text/plain' });
                                        element.href = URL.createObjectURL(file);
                                        const filename = digitalItem.id.includes("vpn") ? "gpkos_vpn_client_config.conf" : "gpkos_assist_license.key";
                                        element.download = filename;
                                        document.body.appendChild(element);
                                        element.click();
                                        document.body.removeChild(element);
                                        alert(`📥 「${digitalItem.title}」专属密钥配置文件已成功触发下载！`);
                                      }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg transition duration-150 border-none active:scale-95 cursor-pointer flex items-center gap-1"
                                  >
                                    📥 触发客户端配置下载
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Shopping Cart */}
        {view === "cart" && (
          <div className="flex-grow bg-slate-50 p-6 overflow-y-auto text-left">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Cart items */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-extrabold text-slate-800 text-base">全球分布式购物车</h3>
                {cart.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center">
                    <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <span className="font-bold text-slate-600 block text-xs">购物车暂无商品</span>
                    <button onClick={() => setView("browse")} className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition">回到货架</button>
                  </div>
                ) : (
                  cart.map((it, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={it.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{it.title}</h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            数量: {it.quantity || 1} ea • 卖家: @{it.seller}
                          </span>
                          {it.selectedOptions && (
                            <div className="flex gap-1.5 mt-1 flex-wrap">
                              {Object.keys(it.selectedOptions).map(ok => (
                                <span key={ok} className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.2 rounded">
                                  {ok}: {it.selectedOptions[ok]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-4 shrink-0">
                        <span className="font-black text-xs text-slate-900">${(it.price * (it.quantity || 1)).toFixed(2)}</span>
                        <button onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Checkout Summary */}
              {cart.length > 0 && (
                <div className="bg-white border border-slate-200 p-5 rounded-3xl h-fit space-y-4 shadow">
                  <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-100 pb-2">账单总和</h3>
                  <div className="text-xs space-y-2 text-slate-500">
                    <div className="flex justify-between">
                      <span>商品金额</span>
                      <span className="font-bold text-slate-800">${cart.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>托管担保手续险 & 快递</span>
                      <span className="font-bold text-slate-800">$15.00</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-slate-900 pt-2.5 border-t border-slate-100">
                      <span>总计金额 (Total)</span>
                      <span>${(cart.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0) + 15).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setView("checkout")}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-100 text-center"
                  >
                    前往收银台安全支付
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW: Safe checkout */}
        {view === "checkout" && (
          <div className="flex-grow bg-slate-50 p-6 overflow-y-auto text-left relative">
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <div className="font-bold text-slate-800 text-sm">Processing Payment...</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Connecting to secure gateway</div>
              </div>
            )}
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                  <CreditCard className="text-blue-500 w-5 h-5" /> 链上安全托管收银台
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">请挑选任一支付通道。系统将代保管款项直至您价格无误确认拨付。</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                <button
                  onClick={() => handleCheckoutSubmit("alipay")}
                  className="p-3 border border-slate-200 rounded-2xl hover:border-blue-500 transition-colors flex flex-col items-center gap-1"
                >
                  <span className="text-blue-500 font-extrabold">Alipay</span>
                  <span className="text-[10px] text-slate-500">支付宝担保付</span>
                </button>
                <button
                  onClick={() => handleCheckoutSubmit("wechat")}
                  className="p-3 border border-slate-200 rounded-2xl hover:border-green-500 transition-colors flex flex-col items-center gap-1"
                >
                  <span className="text-green-500 font-extrabold">WeChat</span>
                  <span className="text-[10px] text-slate-500">微信极速收</span>
                </button>
                <button
                  onClick={() => handleCheckoutSubmit("paypal")}
                  className="p-3 border border-slate-200 rounded-2xl hover:border-indigo-500 transition-colors flex flex-col items-center gap-1"
                >
                  <span className="text-indigo-600 font-extrabold">PayPal</span>
                  <span className="text-[10px] text-slate-500">PayPal 国际付</span>
                </button>
                <button
                  onClick={() => handleCheckoutSubmit("card")}
                  className="p-3 border border-slate-200 rounded-2xl hover:border-slate-800 transition-colors flex flex-col items-center gap-1"
                >
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] text-slate-500 font-bold">信用卡/借记卡</span>
                </button>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button onClick={() => setView("cart")} className="flex-grow py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition">返回</button>
                <button
                  onClick={() => handleCheckoutSubmit("card")}
                  className="flex-grow py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow"
                >
                  确认付款 ${(cart.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0) + 15).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Escrow Payment Success */}
        {view === "success" && (
          <div className="flex-grow bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-left">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base mb-1">🎉 智能托管付款成功！</h3>
            <p className="text-slate-500 max-w-sm text-xs leading-relaxed mb-6">
              您的宝贝款项已成功锁定保存在 **GPKOS 系统多签收账中心**。价格核实后，托管款将全额安全拨付给卖家。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setView("browse")}
                className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition"
              >
                回到货架
              </button>
              <button
                onClick={() => setView("admin-escrow")}
                className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition"
              >
                前往收账中心
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
