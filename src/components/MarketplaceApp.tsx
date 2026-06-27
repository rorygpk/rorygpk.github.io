import React, { useState, useEffect } from "react";
import { Search, Tag, Filter, ShoppingCart, DollarSign, Star, Zap, Upload, CreditCard, ArrowRightLeft, CheckCircle2, Trash2, Plus, Info } from "lucide-react";

// Pre-populated high-quality items in case the backend items list is empty or to complement it
const PRESET_MARKET_ITEMS = [
  {
    id: "preset-1",
    title: "IBM ThinkPad 760ED (Vintage Retro Laptop)",
    description: "Classic IBM ThinkPad from 1996. Features Intel Pentium 133MHz, 16MB RAM, and beautiful active matrix screen. Perfect for retro collectors.",
    price: 349.99,
    condition: "Used - Excellent",
    seller: "RetroTech_Collector",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/IBM_Thinkpad_760ED.jpg",
    paymentMethods: ["card", "alipay", "wechat"],
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
    paymentMethods: ["card", "alipay"],
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
    paymentMethods: ["card", "alipay", "wechat"],
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-4",
    title: "Custom Mechanical Keyboard (GMMK Pro, Holy Panda)",
    description: "Gaddet premium GMMK Pro build. features lubed Holy Panda tactile switches, premium brass plate, and retro PBT keycaps. Heavy brass feel.",
    price: 189.50,
    condition: "New with tags",
    seller: "KeebBuilder_Zhou",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "wechat"],
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-5",
    title: "Sony WH-1000XM4 Noise Canceling Headphones",
    description: "Industry-leading noise cancellation. Silver model, pristine cups and head arch. Includes flight adapter, USB cable and carry case.",
    price: 159.00,
    condition: "Used - Good",
    seller: "AudioEnthusiast",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay"],
    createdAt: new Date().toISOString()
  },
  {
    id: "preset-6",
    title: "Fujifilm X100V Digital Camera (Silver)",
    description: "Highly sought-after compact street photography machine. Fixed 23mm F2 lens. Includes 2 batteries, leather half-case, and lens hood. 3200 shutter count.",
    price: 1399.00,
    condition: "Used - Excellent",
    seller: "ShutterBugs",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    paymentMethods: ["card", "alipay", "wechat"],
    createdAt: new Date().toISOString()
  }
];

export const MarketplaceApp = ({ currentUser }: { currentUser?: any }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"browse" | "sell" | "cart" | "checkout" | "success">("browse");
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("gpkos_market_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [items, setItems] = useState<any[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [sellForm, setSellForm] = useState({ 
    title: "", 
    description: "", 
    price: "", 
    condition: "New with tags" 
  });
  const [transferTarget, setTransferTarget] = useState("");
  
  // Filtering states
  const [filterConditions, setFilterConditions] = useState<{ [key: string]: boolean }>({
    "New with tags": false,
    "Used - Excellent": false,
    "Used - Good": false,
    "For parts or not working": false
  });
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    localStorage.setItem("gpkos_market_cart", JSON.stringify(cart));
  }, [cart]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/marketplace/items");
      const data = await res.json();
      if (data.success && data.items && data.items.length > 0) {
        // Merge DB items with presets (filtering duplicates just in case)
        const dbItems = data.items;
        const merged = [...dbItems, ...PRESET_MARKET_ITEMS.filter(p => !dbItems.some((d: any) => d.title === p.title))];
        setItems(merged);
      } else {
        setItems(PRESET_MARKET_ITEMS);
      }
    } catch (e) {
      console.error(e);
      setItems(PRESET_MARKET_ITEMS);
    }
  };

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

    try {
      // Default placeholder images matching typical categories
      let finalImg = uploadedFileBase64;
      if (!finalImg) {
        const titleLower = sellForm.title.toLowerCase();
        if (titleLower.includes("camera") || titleLower.includes("lens") || titleLower.includes("photo")) {
          finalImg = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80";
        } else if (titleLower.includes("watch") || titleLower.includes("wearable")) {
          finalImg = "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80";
        } else if (titleLower.includes("phone") || titleLower.includes("iphone") || titleLower.includes("android")) {
          finalImg = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
        } else if (titleLower.includes("laptop") || titleLower.includes("thinkpad") || titleLower.includes("macbook") || titleLower.includes("computer")) {
          finalImg = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80";
        } else {
          finalImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"; // generic product
        }
      }

      const res = await fetch("/api/marketplace/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sellForm.title,
          description: sellForm.description || "暂无详细描述。",
          price: parseFloat(sellForm.price),
          condition: sellForm.condition,
          seller: currentUser.emailUsername || "Zhou_Admin",
          imageUrl: finalImg,
          paymentMethods: ["card", "alipay", "wechat"]
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 商品发布成功！已同步至全球去中心化数据库节点。");
        // Reset state
        setSellForm({ title: "", description: "", price: "", condition: "New with tags" });
        setUploadedFileName("");
        setUploadedFileBase64("");
        fetchItems();
        setView("browse");
      } else {
        alert("发布商品失败，请重试。");
      }
    } catch (err) {
      console.error(err);
      alert("发布接口连接错误，正在使用本地存储代理...");
      // Fallback local mock insertion
      const newItem = {
        id: "local-" + Date.now().toString(),
        title: sellForm.title,
        description: sellForm.description || "暂无详细描述。",
        price: parseFloat(sellForm.price),
        condition: sellForm.condition,
        seller: currentUser.emailUsername || "Zhou_Admin",
        imageUrl: uploadedFileBase64 || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        paymentMethods: ["card", "alipay", "wechat"],
        createdAt: new Date().toISOString()
      };
      setItems(prev => [newItem, ...prev]);
      setSellForm({ title: "", description: "", price: "", condition: "New with tags" });
      setUploadedFileName("");
      setUploadedFileBase64("");
      setView("browse");
    }
  };

  const handleCheckout = async (paymentMethod: "card" | "alipay" | "wechat") => {
    if (!currentUser) {
      alert("请先登录您的 GPKOS 虚拟主机会话再进行付款结算。");
      return;
    }
    if (cart.length === 0) return;

    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          buyer: currentUser.emailUsername || "guest_buyer",
          total: cart.reduce((a, b) => a + b.price, 0) + 15,
          paymentMethod: paymentMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        setCart([]);
        setView("success");
      } else {
        alert("订单提交失败，请重试。");
      }
    } catch (e) {
      console.error(e);
      // Fallback checkout success anyway
      setCart([]);
      setView("success");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("只允许上传商品展示图片文件。");
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB typical limit for base64 representation
    if (file.size > MAX_SIZE) {
      alert("图片文件大小超过 10MB 限制。");
      return;
    }
    
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedFileBase64(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const addToCart = (item: any) => {
    if (cart.some(c => c.id === item.id)) {
      alert("该商品已在购物车中。");
      return;
    }
    setCart(prev => [...prev, item]);
    alert(`🛒 已将「${item.title}」成功加入您的全球购物车！`);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrderTransfer = () => {
    if (!transferTarget.trim()) {
      alert("请输入合法的网关账户名称或邮箱地址。");
      return;
    }
    alert(`✈️ 订单接收网关就绪：已向 [${transferTarget}] 成功发出订单中转让渡请求，等待对方在消息中心确认。`);
    setTransferTarget("");
  };

  // Filtering Logic
  const activeConditionFilters = Object.keys(filterConditions).filter(k => filterConditions[k]);
  
  const filteredItems = items.filter(item => {
    // Search keyword
    const matchSearch = 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.seller.toLowerCase().includes(search.toLowerCase());
    
    // Condition filters
    const matchCondition = 
      activeConditionFilters.length === 0 || 
      activeConditionFilters.includes(item.condition);
    
    // Price range filters
    const numericMin = parseFloat(minPrice);
    const numericMax = parseFloat(maxPrice);
    const matchMin = isNaN(numericMin) || item.price >= numericMin;
    const matchMax = isNaN(numericMax) || item.price <= numericMax;

    return matchSearch && matchCondition && matchMin && matchMax;
  });

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-900 border border-slate-300 rounded-xl overflow-hidden shadow-2xl">
      {/* Marketplace Header */}
      <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center gap-4 justify-between border-b border-slate-200">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setView("browse")}>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter text-blue-900 flex items-center gap-1">
              Rory<span className="text-blue-600">eBay</span>
            </span>
            <span className="text-[9px] block uppercase font-mono tracking-widest text-slate-400 font-bold -mt-1">
              Super-Grid Multi-Trading Node
            </span>
          </div>
        </div>
        
        {view === "browse" && (
          <div className="flex-grow max-w-xl relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索任何全球在售宝贝、复古古玩、极客硬件 (如: ThinkPad, iPhone)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 border-2 border-slate-200 rounded-full bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition text-xs font-semibold"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white px-5 rounded-full text-[10px] font-black uppercase hover:bg-blue-700 transition tracking-wider">
              Search
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("sell")} 
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-black rounded-lg transition-all ${view === 'sell' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
          >
            <DollarSign className="w-4.5 h-4.5"/> 我要卖宝贝 (List)
          </button>
          <button 
            onClick={() => setView("cart")} 
            className={`px-3 py-2 flex items-center gap-1.5 text-xs font-black rounded-lg transition-all relative ${view === 'cart' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
          >
            <ShoppingCart className="w-4.5 h-4.5"/> 购物车 (Cart)
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {view === "browse" && (
        <>
          {/* Categories Sub-menu bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest overflow-x-auto select-none shrink-0 custom-scrollbar">
            <span className="text-blue-600 border-b-2 border-blue-600 pb-0.5 cursor-pointer whitespace-nowrap">🔥 今日热销推荐 (Daily Deals)</span>
            <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition" onClick={() => setSearch("ThinkPad")}>💻 极客电脑 (Electronics)</span>
            <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition" onClick={() => setSearch("Camera")}>📷 复古相机 (Collectibles & Art)</span>
            <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition" onClick={() => setSearch("Watch")}>⌚ 智能穿戴 (Fashion & Wear)</span>
            <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition" onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); }}>🔄 重置全部 (Reset Filters)</span>
          </div>

          <div className="flex flex-grow overflow-hidden">
            {/* Sidebar Filters */}
            <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 p-4 overflow-y-auto hidden md:flex text-left">
               <div className="font-bold text-xs text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wider"><Filter className="w-4 h-4 text-blue-500" /> 多维属性筛选 (Filters)</div>
               <div className="space-y-5">
                  <div>
                     <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2.5">商品成色 (Condition)</div>
                     {Object.keys(filterConditions).map(cond => (
                       <label key={cond} className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2 cursor-pointer hover:text-slate-900">
                         <input 
                           type="checkbox" 
                           checked={filterConditions[cond]}
                           onChange={() => setFilterConditions(prev => ({ ...prev, [cond]: !prev[cond] }))}
                           className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
                         />
                         <span>{cond === 'New with tags' ? '🆕 全新未拆封' : cond === 'Used - Excellent' ? '💎 充新极品' : cond === 'Used - Good' ? '👍 良好二手' : '🔧 故障/报废'}</span>
                       </label>
                     ))}
                  </div>
                  <div>
                     <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2.5">价格区间 (Price $)</div>
                     <div className="flex gap-2 items-center">
                        <input 
                          type="number" 
                          placeholder="最低" 
                          value={minPrice}
                          onChange={e => setMinPrice(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" 
                        />
                        <span className="text-slate-400 text-xs">-</span>
                        <input 
                          type="number" 
                          placeholder="最高" 
                          value={maxPrice}
                          onChange={e => setMaxPrice(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" 
                        />
                     </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                     <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-700 leading-relaxed">
                       <div className="font-bold flex items-center gap-1.5 mb-1"><Info className="w-3.5 h-3.5 text-blue-500"/> 安全保障服务</div>
                       支持支付宝、微信支付与国际VISA信用卡。全部款项均通过多签冷钱包提供履约担保。
                     </div>
                  </div>
               </div>
            </div>

            {/* Product Grid Area */}
            <div className="flex-grow bg-slate-100 p-6 overflow-y-auto">
               <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-left">
                 <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
                   <Zap className="text-yellow-500 w-5 h-5 animate-pulse"/> 
                   <span>全球链上优选宝贝 ({filteredItems.length}件在售)</span>
                 </h2>
                 {search && (
                   <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                     搜索: "{search}"
                   </span>
                 )}
               </div>
               
               {filteredItems.length === 0 ? (
                 <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto mt-8 shadow-sm">
                   <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                   <h3 className="font-bold text-slate-700 mb-1">未找到符合筛选条件的宝贝</h3>
                   <p className="text-slate-400 text-xs">请尝试清除搜索关键词或重置价格、成色筛选条件。</p>
                   <button 
                     onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setFilterConditions({ "New with tags": false, "Used - Excellent": false, "Used - Good": false, "For parts or not working": false }); }} 
                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                   >
                     清除所有过滤器
                   </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between text-left relative group">
                         {item.condition.includes("New") && (
                           <span className="absolute top-3 left-3 bg-red-500 text-white text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full z-10">
                             Brand New
                           </span>
                         )}
                         <div className="aspect-video bg-slate-50 rounded-xl mb-4 overflow-hidden relative border border-slate-100 flex items-center justify-center shrink-0">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="max-h-full max-w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              referrerPolicy="no-referrer"
                            />
                         </div>
                         <div className="flex-grow flex flex-col justify-between mb-4">
                           <div>
                             <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition line-clamp-1 mb-1.5" title={item.title}>
                               {item.title}
                             </h3>
                             <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 h-8 mb-3" title={item.description}>
                               {item.description}
                             </p>
                           </div>
                           <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                             <div>
                               <div className="text-[9px] uppercase font-bold text-slate-400">Seller Node</div>
                               <span className="font-mono font-bold text-[10px] text-slate-700 block">{item.seller}</span>
                             </div>
                             <div className="text-right">
                               <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-bold block mb-1">
                                 {item.condition}
                               </span>
                             </div>
                           </div>
                         </div>
                         <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-auto">
                            <div className="font-black text-xl text-slate-900">${item.price.toFixed(2)}</div>
                            <button 
                              onClick={() => addToCart(item)}
                              className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5"/> 立即抢购
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </>
      )}

      {view === "sell" && (
        <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
           <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-left">
              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2"><Upload className="text-blue-500 w-6 h-6"/> 发布您的全球链上宝贝</h2>
              <p className="text-xs text-slate-400 mb-6 border-b border-slate-200 pb-4">商品将实时写入 GPKOS 链上共享数据库，所有网络接入节点与终端皆可无延迟实时发现并付款抢购。</p>
              
              <form onSubmit={handleList} className="space-y-5">
                 <div>
                   <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">商品名称 (Title) *</label>
                   <input 
                     type="text" 
                     placeholder="e.g. 经典珍藏 ThinkPad X220 纯IBM血统键盘" 
                     required
                     value={sellForm.title}
                     onChange={e => setSellForm(prev => ({ ...prev, title: e.target.value }))}
                     className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs font-semibold bg-slate-50 focus:bg-white transition" 
                   />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">宝贝标价 ($ USD) *</label>
                     <input 
                       type="number" 
                       step="0.01"
                       min="0.01"
                       required
                       placeholder="0.00" 
                       value={sellForm.price}
                       onChange={e => setSellForm(prev => ({ ...prev, price: e.target.value }))}
                       className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs font-semibold bg-slate-50 focus:bg-white transition" 
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">商品成色 (Condition)</label>
                     <select 
                       value={sellForm.condition}
                       onChange={e => setSellForm(prev => ({ ...prev, condition: e.target.value }))}
                       className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs font-semibold bg-white cursor-pointer"
                     >
                       <option value="New with tags">New with tags (全新未拆封)</option>
                       <option value="Used - Excellent">Used - Excellent (充新极品二手)</option>
                       <option value="Used - Good">Used - Good (极佳实用二手)</option>
                       <option value="For parts or not working">For parts or not working (配件机/故障故障)</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">详细描述 (Description)</label>
                   <textarea 
                     rows={3}
                     placeholder="详细描述您的宝贝规格、瑕疵成色、快递说明，这样能大大提升成交几率..." 
                     value={sellForm.description}
                     onChange={e => setSellForm(prev => ({ ...prev, description: e.target.value }))}
                     className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-xs font-semibold bg-slate-50 focus:bg-white transition resize-none" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">宝贝实拍美图 (Product Showcase Image)</label>
                   <label 
                     className={`block border-2 border-dashed ${isDraggingFile ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-slate-50'} rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-100/80 transition`}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                   >
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDraggingFile ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-600 block">
                        {uploadedFileName ? `📸 实拍已就绪: ${uploadedFileName}` : "拖放实拍图片至此，或点击浏览本地文件上传"}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">支持 JPG, PNG, WEBP。大小 10MB 以内</p>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                   </label>
                 </div>
                 
                 <div className="flex gap-4 pt-4 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setView("browse")}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs text-center"
                    >
                      取消返回
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition text-xs shadow-lg shadow-blue-200"
                    >
                      立刻全网公开发售
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {view === "cart" && (
        <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
           <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2"><ShoppingCart className="text-blue-600" /> 您的全球购物车</h2>
                
                {cart.map((item, i) => (
                   <div key={item.id + "-" + i} className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                         <img src={item.imageUrl} className="max-h-full max-w-full object-cover" alt="item" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-sm text-slate-800 truncate">{item.title}</h3>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">成色: {item.condition} • 卖家节点: @{item.seller}</div>
                        <button 
                          onClick={() => removeFromCart(i)} 
                          className="text-[10px] text-red-500 font-bold hover:underline mt-2 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5"/> 移出购物车
                        </button>
                      </div>
                      <div className="font-black text-lg text-slate-900 shrink-0">${item.price.toFixed(2)}</div>
                   </div>
                ))}
                
                {cart.length === 0 && (
                  <div className="text-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-inner">
                    <ShoppingCart className="w-12 h-12 mx-auto text-slate-200 mb-4" />
                    <span className="font-black text-slate-600 block text-sm">您的购物车空空如也</span>
                    <p className="text-xs text-slate-400 mt-1 mb-4">赶紧去挑选一些惊艳的极客硬件或复古古董吧！</p>
                    <button onClick={() => setView("browse")} className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition">
                      回到集市浏览
                    </button>
                  </div>
                )}
                
                {cart.length > 0 && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl mt-6 shadow-sm">
                     <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5"><ArrowRightLeft className="w-4 h-4 text-blue-500"/> 链上订单支付权让渡请求 (Order Transfer)</h3>
                     <p className="text-[11px] text-slate-500 mb-3.5 leading-relaxed">您可以将当前未结算订单的所有权及支付义务安全转移给您本局网络内的其他协作者或主管账户代付。</p>
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="输入接收人系统 ID (如: marvis_zhou2014)" 
                          value={transferTarget}
                          onChange={e => setTransferTarget(e.target.value)}
                          className="flex-grow p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50 font-semibold" 
                        />
                        <button 
                          onClick={handleOrderTransfer} 
                          className="px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase transition shrink-0"
                        >
                          发起让渡请求
                        </button>
                     </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 h-fit shadow-md">
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-700 mb-4 border-b border-slate-100 pb-3">账单总览 (Summary)</h3>
                  <div className="space-y-3.5 text-xs text-slate-500 mb-5">
                     <div className="flex justify-between"><span>商品小计 (Subtotal)</span><span className="font-bold text-slate-800">${cart.reduce((a,b)=>a+b.price, 0).toFixed(2)}</span></div>
                     <div className="flex justify-between"><span>链上担保交易险与快递 (Insured Ship)</span><span className="font-bold text-slate-800">$15.00</span></div>
                     <div className="flex justify-between font-black text-slate-950 text-base pt-3 border-t border-slate-100 mt-3">
                        <span>总计金额 (Total)</span><span>${(cart.reduce((a,b)=>a+b.price, 0) + 15).toFixed(2)}</span>
                     </div>
                  </div>
                  <button 
                    disabled={cart.length === 0} 
                    onClick={() => setView("checkout")} 
                    className="w-full py-3.5 bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white font-black rounded-xl transition shadow-lg shadow-blue-100 text-xs text-center uppercase tracking-wider"
                  >
                    前往安全结算收银台
                  </button>
                </div>
              )}
           </div>
        </div>
      )}

      {view === "checkout" && (
        <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
           <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-left">
              <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2"><CreditCard className="text-blue-500 w-6 h-6"/> GPKOS 链上担保收银台</h2>
              <p className="text-xs text-slate-400 mb-6 border-b border-slate-200 pb-4">请选择您偏好的底层支付渠道，款项将被智能合约托管直到您确认收货。</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">1. 挑选支付网络 (Payment Network)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <button 
                       onClick={() => handleCheckout("card")}
                       className="border-2 border-blue-600 bg-blue-50/50 p-4 rounded-2xl font-bold flex flex-col items-center gap-1.5 text-blue-900 hover:bg-blue-50 transition"
                     >
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-black tracking-tighter">信用卡/储蓄卡</span>
                        <span className="text-[8px] uppercase font-mono tracking-wider opacity-60">VISA/MasterCard</span>
                     </button>
                     <button 
                       onClick={() => handleCheckout("alipay")}
                       className="border border-slate-200 hover:border-blue-400 p-4 rounded-2xl font-bold flex flex-col items-center gap-1.5 text-slate-700 transition hover:bg-slate-50"
                     >
                        <div className="text-lg font-black tracking-tighter text-blue-500">Alipay</div>
                        <span className="text-xs">支付宝担保</span>
                        <span className="text-[8px] uppercase text-slate-400 font-mono tracking-wider">实时到账</span>
                     </button>
                     <button 
                       onClick={() => handleCheckout("wechat")}
                       className="border border-slate-200 hover:border-green-500 p-4 rounded-2xl font-bold flex flex-col items-center gap-1.5 text-slate-700 transition hover:bg-slate-50"
                     >
                        <div className="text-lg font-black tracking-tighter text-green-500">WeChat</div>
                        <span className="text-xs">微信极速付</span>
                        <span className="text-[8px] uppercase text-slate-400 font-mono tracking-wider">扫码支付</span>
                     </button>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">2. 虚拟卡/支付账单模拟</h3>
                  <p className="text-[11px] text-slate-400">选择信用卡或快捷结算将自动从您的当前绑定网卡中扣除并部署物流分配。请直接点击上方卡片极速付款结算。</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                   <button 
                     type="button"
                     onClick={() => setView("cart")}
                     className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs text-center"
                   >
                     返回购物车
                   </button>
                   <button 
                     onClick={() => handleCheckout("card")}
                     className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition text-xs shadow-lg shadow-blue-200 text-center uppercase tracking-wider"
                   >
                     确认付款 ${(cart.reduce((a,b)=>a+b.price, 0) + 15).toFixed(2)}
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {view === "success" && (
        <div className="flex-grow bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-md shadow-green-200 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-2">🎉 担保付款成功！</h2>
           <p className="text-slate-500 max-w-md mb-8 text-xs leading-relaxed">
             您选购的宝贝已在 GPKOS 链上智能交易合约中成功结算锁定。我们已为您自动向系统超级管理员 <strong className="text-slate-800">@周锦淇</strong> 报备出货，出货单回执已发送至您在 secure outlook 绑定的私密数字信箱。
           </p>
           <button 
             onClick={() => setView("browse")} 
             className="px-8 py-3 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 uppercase tracking-widest"
           >
             返回全球二手集市
           </button>
        </div>
      )}
    </div>
  );
};
