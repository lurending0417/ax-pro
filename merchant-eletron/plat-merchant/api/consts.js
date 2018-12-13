export default {
    _WAREHOUSE_GET_POST: '/goods/wareHouse',
    _WAREHOUSE_DELETE_GET_PUT: '/goods/wareHouse/{wareHouseId}',
    _STOCK_GET_POST: '/goods/stock',
    _STOCK_DELETE_GET_PUT: '/goods/stock/{stockBillId}',
    _STOCK_ITEMS_GET_POST: '/goods/stock/{stockBillId}/items',
    _STOCK_ITEM_PUT_DELETE: '/goods/stock/{stockBillId}/items/{stockItemId}',
    _STOCK_ITEM_PARAMS_GET: '/goods/stock/{billId}/items/{itemId}/props',
    _STOCK_ITEM_PARAMS_PUT: '/goods/stock/{billId}/items/{itemId}/props',
    _STOCK_ITEM_SUBMIT_AUDIT: '/goods/stock/submit',
    _STOCK_WEIGHT_DIFF: '/goods/stock/weightDiff', // 秤差分摊
    _USER_TOKEN_POST: '/user/login', // 用手机号码+验证码 或 手机号码+密码 登录
    _SEND_MS_CODE: 'sms/sms/rand', // 发送手机验证码
    _USER_LOGOUT_POST: '/user/logout', // 退出登录
    _USER_RESET_PASSWORD: '/user/password', // 重置密码(put)
    _USER_LOGIN_SWITCH_MERCHANT: '/user/login/switchMerchant', // 切换多商户
    _GET_META_DATA: '/user/profile', // 获取用户信息及metadata元数据
    // _USER_RESET_PASSWORD: 'user/resetPassword', // 重置登录密码(post)
    _USER_GET_POST: '/user',
    _WARE_BASE_INFO_SUPPLIER_GET: '/goods/vendor',
    _WARE_BASE_INFO_SUPPLIER_GET_SEARCH: '/goods/vendor/{vendorId}',
    _WARE_BASE_INFO_SUPPLIER_POST: '/goods/vendor',
    _WARE_BASE_INFO_SUPPLIER_PUT: '/goods/vendor/{vendorId}',
    _WARE_BASE_INFO_CATEGORY_GET: '/goods/category',
    _WARE_BASE_INFO_CATEGORY_POST: '/goods/category',
    _WARE_BASE_INFO_CATEGORY_PUT: '/goods/category/{categoryId}',
    _WARE_BASE_INFO_PARAMS_GET: '/goods/property/field/{type}/{targetId}',
    _WARE_BASE_INFO_PARAMS_POST: '/goods/property/field',
    _WARE_BASE_INFO_PARAMS_PUT: '/goods/property/field/{fieldId}',
    _WARE_BASE_INFO_PARAMS_DELETE: '/goods/property/field/{fieldId}',
    _WARE_BASE_INFO_GEM_GET: '/goods/gem',
    _WARE_BASE_INFO_GEM_POST: '/goods/gem',
    _WARE_BASE_INFO_GEM_DELETE: '/goods/gem/{gemId}',
    _WARE_BASE_INFO_GEM_PUT: '/goods/gem/{gemId}',
    _WARE_BASE_INFO_METAL_GET: '/goods/metal',
    _WARE_BASE_INFO_METAL_POST: '/goods/metal',
    _WARE_BASE_INFO_METAL_DELETE: '/goods/metal/{metalId}',
    _WARE_BASE_INFO_METAL_PUT: '/goods/metal/{metalId}',
    _WARE_BASE_INFO_CRAFT_GET: '/goods/craft',
    _WARE_BASE_INFO_CRAFT_POST: '/goods/craft',
    _WARE_BASE_INFO_CRAFT_DELETE: '/goods/craft/{craftId}',
    _WARE_BASE_INFO_CRAFT_PUT: '/goods/craft/{craftId}',
    _WARE_BASE_INFO_GOLDPRICE_GET: '/goods/metal/price',
    _WARE_BASE_INFO_GOLDPRICE_PUT: '/goods/metal/{metalId}/price',
    _WARE_BASE_INFO_HISTORY_GET: '/history/{entityId}',
    _STOCK_ALLOCATE_GET: '/goods/allocate',
    _STOCK_ALLOCATE_ADD_POST: '/goods/allocate',
    _STOCK_ALLOCATE_ADD_PUT: '/goods/allocate/{billId}',
    _STOCK_ALLOCATE_ADD_ITEMS_GET: '/goods/allocate/{billId}/items',
    _STOCK_ALLOCATE_ADD_ITEMS_POST: '/goods/allocate/{billId}/items',
    _STOCK_ALLOCATE_OUT: 'goods/allocate/out', // 调拨出库
    _STOCK_ALLOCATE_REJECT: 'goods/allocate/reject', // 拒绝收货
    _STOCK_ALLOCATE_CONFIRM: 'goods/allocate/confirm', // 确认拒收
    _STOCK_ALLOCATE_ACCEPT: 'goods/allocate/accept', // 确认收货
    _STOCK_ALLOCATE_BILL_DELETE: 'goods/allocate/{billId}', // 删除调拨单
    _STOCK_ALLOCATE_BILL_DETAIL: 'goods/allocate/{billId}/items', // 调拨单详情
    _STOCK_ALLOCATE_BILL_ACCEPT: 'goods/allocate/accept', // 调拨单详情确认收货
    _STOCK_ALLOCATE_BILL_REJECT: 'goods/allocate/reject', // 调拨单详情拒绝收货
    _STOCK_ALLOCATE_BILL_CONFIRM_REJECT: 'goods/allocate/confirm', // 调拨单详情确认拒收
    _STOCK_INVENTORY_BILL_GET: 'goods/inventory', // 获取盘点单
    _STOCK_INVENTORY_BILL_CREATE: 'goods/inventory', // 新建盘点单
    _STOCK_INVENTORY_BILL_DELETE: 'goods/inventory/{billId}', // 删除盘点单
    _STOCK_INVENTORY_BILL_ITEMS_GET: 'goods/inventory/{billId}/items', // 获取盘点单详情
    _STOCK_INVENTORY_BILL_ITEM_UPDATE: 'goods/inventory/{billId}/items/{itemId}', // 修改盘点明细的盘点数量
    _STOCK_INVENTORY_BILL_ITEM_SUBMIT: 'goods/inventory/submit', // 将盘点单执行【提交审核】的操作
    _STOCK_INVENTORY_BILL_ITEM_DETAIL_ADD: 'goods/inventory/{billId}/items', // 添加盘点明细
    _STOCK_INVENTORY_BILL_ITEM_DETAIL_DEL: 'goods/inventory/{billId}/items/{itemId}', // 删除盘点明细
    _STOCK_ALLOCATE_BILL_ITEMS_AMOUNT: 'goods/allocate/{billId}/items/{itemId}', // 调拨单详情修改明细数量
    _STOCK_ALLOCATE_BILL_ITEMS_DELETE: 'goods/stock/{billId}/items/{itemId}', // 删除调拨单明细
    _STOCK_STORAGE_GET: 'goods/storage', // 获取库存信息
    _STOCK_STORAGE_TRANS_RECORD_GET: 'goods/storage/inout', // 获取库存流转记录
    _STOCK_STORAGE_GET_PARAMS: 'goods/storage/{storageId}/view', // 查看库存明细的详情
    _STOCK_STORAGE_PUT_PARAMS: 'goods/storage/{storageId}/props', // 获取、修改库存参数的详情
    _STOCK_REJECT_GET_POST_BILL: 'goods/stock/reject', // 获取、创建 采购退货单
    _STOCK_REJECT_DELETE_BILL: 'goods/stock/reject/{billId}', // 删除采购退货单
    _STOCK_REJECT_GET_POST_ITEM: 'goods/stock/reject/{billId}/items', // 获取、添加 采购退货单明细
    _STOCK_REJECT_DELETE_ITEM: 'goods/stock/reject/{billId}/items/{itemId}', // 删除采购退货单明细
    _STOCK_REJECT_SUBMIT_BILL: 'goods/stock/reject/submit', // 提交审核采购退货单
    _RETAIL_GET_POST_BILL: 'retail/retail', // 获取、提交 销售单
    _RETAIL_DELETE_GET_BILL: 'retail/retail/{billId}', // 删除、查询某个销售单
    _RETAIL_GET_BILL_ITEM: 'retail/retail/{billId}/items', // 获取销售单详情
    _RETAIL_GET_TO_REJECT: 'retail/toReject', // 根据手机号、收银单号 获取可退货销售单明细
    _GOODS_STOCK_TEMPLATE: 'goods/stock/template', // 获取,导入采购入库导入模板

    // 报表统计
    _REPORT_STORAGE_OUT_STAT: 'report/storage/out/stat', // 获取商品流转统计表
    _REPORT_STORAGE_CHECKOUT: 'report/storage/checkOut', // 获取商品的出入库统计
    _REPORT_STORAGE_CHECKOUT_DETAIL: 'report/storage/checkOut/detail', // 获取商品出入库统计的详情
    _REPORT_FINANCE_GOLD_STAT_DAILY: 'report/finance/gold/stat/daily', // 获取黄金日统计表
    _REPORT_FINANCE_WALLET_STAT_DAILY: 'report/finance/wallet/stat/daily', // 获取钱包日统计表
    _REPORT_FINANCE_LEASE_STAT_INCOME: 'report/finance/lease/stat/income', // 获取试戴收入日账单

    // 简版质保单
    _RETAIL_CONSUME_GET: 'retail/consume', // 查询或筛选消费流水（简版补录的质保单）
    _RETAIL_CONSUME_POST: 'retail/consume', // 补录消费流水（简版补录电子质保单）
    _RETAIL_CONSUME_DETAIL_GET: 'retail/consume/{billId}', // 查询某个消费流水（简版补录的质保单）
    _RETAIL_CONSUME_DETAIL_ITEMS_GET: 'retail/consume/{billId}/items', // 获取消费流水详情（简版补录的质保单详情）
    _GOODS_STORAGE_PUT: 'goods/storage/{storageId}', // 修改库存信息

    _REPAIR_BILL_GET_POST: 'retail/repair', // 获取维修单,新增
    _REPAIR_BILL_GET_MODIFY: 'retail/repair/{recordId}', // 修改维修单
    _RETAIL_GET_TO_REPAIR: 'retail/toRepair', // 查询销售记录用于维修

    _STOCK_GET_STORAGE: 'goods/storage/toRetail', // 根据条形码获取商品
    _METAL_PRICE_GET: 'goods/metal/price', // 获取所有材质的今日价格
    _RETAIL_BILL_GET_POST: 'retail/retail', // 获取或添加销售单
    _PAYMENT_BILL_GET_POST: 'retail/payment', // 获取、新增收银单
    _PAYMENT_TO_PAY_GET: 'retail/toPay', // 根据单据编号查找单据并结账
    _PAYMENT_BILL_GET: 'retail/payment', // 获取收银单
    _RETAIL_RECYCLE_BILL: 'retail/recycle', // 查询或筛选 、 新增回收单
    _RETAIL_RECYCLE_BILL_ITEM_OPRERATE: 'retail/recycle/{billId}', // 获取某个 、 删除回收单
    _RETAIL_RECYCLE_BILL_ITEM_DETAIL: 'retail/recycle/{billId}/items', // 获取回收单详情
    _PAYMENT_BILL_GET_DETAIL: 'retail/payment/{billId}', // 获取某个付款单详情
    _REJECT_BILL_GET_POST: 'retail/reject', // 获取、新增退货单
    _STORE_LIST_GET: 'store', // 获取商户的门店 向商户添加门店
    _MERCHANT_STORE_ITEM_UPDATE: 'store/{storeId}', // 修改门店基本资料
    _MERCHANT_STAFF_GET: 'user/staff', // 获取商户内的员工 向商户添加员工
    _MERCHANT_STAFF_UPDATE: 'user/staff/{staffId}', // 修改商户员工
    _AUDIT_FLOW_GET: 'audit/flow', // 获取或筛选审批流程 新增审批流程
    _AUDIT_FLOW_UPDATE: 'audit/flow/{flowId}', // 删除、获取、修改审批流程
    _AUDIT_APPROVE: 'audit/approve', // 审核通过
    _AUDIT_DECLINE: 'audit/decline', // 审核不通过，驳回
    _AUDIT_NODE_LIST_GET: 'audit/flow/{flowId}/node', // 获取流程节点
    _AUDIT_RECORD_ALL_GET: 'audit/record', // 获取或筛选审批记录
    _AUDIT_RECORD_GET: 'audit/record/{recordId}', // 获取审批记录
    _AUDIT_TRANSACTION_GET: 'audit/record/{recordId}/transaction', // 获取审批流转记录
    _DUTY_TPL_GET: 'auth/duty', // 获取所有岗位
    _REJECT_BILL_DELETE: 'retail/reject/{billId}', // 删除退货单
    _REJECT_BILL_ITEM_GET: 'retail/reject/{billId}/items', // 获取退货单详情
    _EXCHANGE_BILL_GET_POST: 'retail/exchange', // 新增、获取 置换单
    _EXCHANGE_BILL_DELETE: 'retail/exchange/{billId}', // 删除 置换单
    _HANDOVER_BILL_GET_POST_DELETE: 'goods/handover', // 获取或筛选交接班记录 发起交接班
    _HANDOVER_BILL_DELETE: 'goods/handover/{recordId}', // 删除交接班记录
    _HANDOVER_BILL_CONFIRM: 'goods/handover/confirm', // 接收交班
    _EXCHANGE_BILL_DELETE_GET: 'retail/exchange/{billId}', // 删除、查询指定置换单
    _EXCHANGE_BILL_ITEM_GET: 'retail/exchange/{billId}/items', // 查询指定置换单回收详情
    _EXCHANGE_BILL_GET_FOR_BIND: 'retail/exchange/bind', // 销售单获取置换单
    // 权限模板
    _AUTH_ACTION_TREE_GET: 'auth/action/tree', // 获取功能树
    _AUTH_ACTION_GROUP_POST_GET: 'auth/action/group', // 添加、获取 功能分组
    _AUTH_ACTION_GROUP_DELETE_GET_MODIFY: 'auth/action/group/{groupId}', // 删除、获取、修改 功能分组
    _AUTH_ACTION_POST_GET: 'auth/action', // 添加、获取 功能
    _AUTH_ACTION_DELETE_GET_MODIFY: 'auth/action/{actionId}', // 删除、获取、修改 功能
    _AUTH_PAGE_GET: 'auth/page/tree', // 获取 页面树
    _AUTH_PAGE_GROUP_GET: 'auth/page/group', // 添加、获取 页面分组功能
    _AUTH_PAGE_GROUP_DELETE_PUT_GET: 'auth/page/group/{groupId}', // 删除、修改、获取 页面分组
    _AUTH_PAGE_POST_GET: 'auth/page', // 添加、获取 页面
    _AUTH_PAGE_DELETE_PUT_GET: 'auth/page/{pageId}', // 删除、修改、获取 页面
    _AUTH_TAB_POST_GET: 'auth/page/tab', // 添加、获取 选项卡
    _AUTH_TAB_DELETE_PUT_GET: 'auth/page/tab/{tabId}', // 删除、修改、获取 选项卡
    _AUTH_PAGE_ACTION_POST_GET: 'auth/page/action', // 获取、添加 页面功能权限
    _AUTH_ROLE_GROUP_TPL_POST_GET: 'auth/role/group/tpl', // 获取、添加 角色分组模板权限
    _AUTH_ROLE_GROUP_TPL_MODIFY_GET_DELETE: 'auth/role/group/tpl/{tplId}', // 获取、修改、删除 某个角色分组模板权限
    _AUTH_ROLE_TPL_POST_GET: 'auth/role/tpl', // 获取、添加 角色模板权限
    _AUTH_ROLE_TPL_MODIFY_GET_DELETE: 'auth/role/tpl/{tplId}', // 获取、修改、删除 某个角色分组模板权限
    _AUTH_ROLE_TREE_TPL_GET: 'auth/role/tpl/tree', // 获取 角色权限树
    _AUTH_DUTY_TPL_POST_GET: 'auth/duty/tpl', // 获取、添加 岗位模板权限
    _AUTH_DUTY_TPL_MODIFY_GET_DELETE: 'auth/duty/tpl/{tplId}', // 获取、修改、删除 某个岗位模板权限
    _AUTH_ROLE_DUTY_TREE_TPL_GET: 'auth/duty/tpl/role/tree', // 获取 岗位授权角色模板的树
    _AUTH_ROLE_DUTY_TPL_POST: 'auth/duty/tpl/role', //  设置 岗位模板的角色
    _AUTH_ROLE_ACTION_TPL_TREE_GET: 'auth/role/tpl/action/tree', //  获取 角色模板授权功能树
    _AUTH_ROLE_ACTION_TPL_POST: 'auth/role/tpl/action', //  设置 角色模板可以访问的页面功能授权
    // 商户管理
    _AUTH_ROLE_GROUP_POST_GET: 'auth/role/group', // 获取、添加 角色分组权限
    _AUTH_ROLE_GROUP_MODIFY_GET_DELETE: 'auth/role/group/{groupId}', // 获取、修改、删除 某个角色分组权限
    _AUTH_ROLE_POST_GET: 'auth/role', // 获取、添加 角色权限
    _AUTH_ROLE_MODIFY_GET_DELETE: 'auth/role/{roleId}', // 获取、修改、删除 某个角色分组权限
    _AUTH_ROLE_TREE_GET: 'auth/role/tree', // 获取 角色权限树
    _AUTH_DUTY_POST_GET: 'auth/duty', // 获取、添加 岗位权限
    _AUTH_DUTY_MODIFY_GET_DELETE: '/auth/duty/{dutyId}', // 获取、修改、删除 某个岗位权限
    _AUTH_ROLE_DUTY_TREE_GET: 'auth/duty/role/tree', // 获取 岗位授权角色的树
    _AUTH_ROLE_DUTY_POST: 'auth/duty/role', //  设置 岗位的角色
    _AUTH_ROLE_ACTION_TREE_GET: 'auth/role/action/tree', //  获取 角色授权功能树
    _AUTH_ROLE_ACTION_POST: 'auth/role/action', //  设置 角色可以访问的页面功能授权
    _STAFF_GET_POST: 'user/staff', //  获取、添加 商户员工
    _STAFF_MODIFY_GET: 'user/staff/{staffId}', // 修改、获取 某个商户员工
    _STAFF_DUTY_GET: 'user/staff/{staffId}/duty', // 修改、获取 某个商户员工
    // 试戴业务
    _LEASE_STORAGE_TEMPLATE: 'lease/storage/template', // 获取/设置试戴商品导入模板
    _LEASE_DEPOSIT_RULE_SETTING: 'lease/depositRule', // 设置押金规则
    _LEASE_RENT_RULE_SETTING: 'lease/rentRule', // 设置租金规则
    _LEASE_DEPOSIT_RULE_GETTING: 'lease/depositRule', // 获取押金规则
    _LEASE_RENT_RULE_GETTING: 'lease/rentRule', // 获取租金规则
    _LEASE_STORAGE_POST_SIMPLE: 'lease/storage/smart', // 添加试戴商品（简化极速版）
    _LEASE_STORAGE_LIST: 'lease/storage', // 获取试戴商品
    _LEASE_CONFIG_DETAIL: 'lease/storage/{storageId}', // 获取试戴商品详细信息
    _LEASE_RECORDS_LIST: 'lease/record', // 获取试戴订单
    _LEASE_RECORDS_DETAIL: 'lease/record/{recordId}', // 获取试戴订单详情
    _LEASE_RECORDS_OUT: 'lease/record/out', // 试戴订单发货
    _LEASE_RECORDS_ACCEPT: 'lease/accept', // 试戴订单收货
    _LEASE_RECORDS_CANCLE: 'lease/record/cancel', // 取消订单
    _LEASE_INSPECTION: 'lease/qc', // 进行商品质检
    _LEASE_INSPECTION_CONFIRM: 'lease/qc/confirm', // 确认质检结果
    _LEASE_INSPECTION_MODIFY: 'lease/qc/{qcId}', // 修改试戴质检记录
    _LEASE_STORAGE_STAT_OUT: 'lease/storage/stat/out', // 获取试戴发货清单
    _LEASE_STORAGE_STAT_IN: 'lease/storage/stat/in', // 获取试戴收货清单
    _REPORT_LEASE_STAT: 'report/lease/stat', // 获取试戴订单统计

    _LEASE_VALIDATE_SERIAL: 'lease/record/{recordId}/serial', // 检测商品条码与试戴订单是否匹配
    // 地址
    _ADDRESS_LIST: 'address', // 获取或者删除地址
    _ADDRESS_ITEM: 'address/{addressId}', // 获取或者删除地址

    // 物流
    _LEASE_PRE_DELIVER_OUT: 'logistics/order', // 预约快递取件
    _LOGISTICS_RECORD: 'logistics/shipping', // 获取物流记录

    // 打印
    _STOKE_LABEL_PRINT: '/goods/print', // 打印标签
    _DOWNLOAD_TEMPLATE: '/goods/print/template/download', // 下载模板

    // 黄金相关
    _ACCOUNT_CASH_GET: 'account/cash', // 获取现金类账户
    _ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE: 'account/cash/wallet/recharge/offline', // 正式提交线下充值单（在此之前请先预创建充值单）
    _ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_ATTACH_ADD: 'account/cash/wallet/recharge/offline/attach', // 添加线下充值单的附件
    _ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_ATTACH_DEL: 'account/cash/wallet/recharge/offline/attach/{attachId}', // 删除线下充值单的附件
    _ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_CONFIRM: 'account/cash/wallet/recharge/offline/confirm', // 确认线下充值订单
    _ACCOUNT_CASH_WALLET_RECHARGE_OFFLINE_PRE: 'account/cash/wallet/recharge/offline/pre', // 预创建线下充值订单
    _ACCOUNT_CASH_WITHDRAW: 'account/cash/withdraw', // 发起提现请求(get: 获取提现记录)
    _ACCOUNT_CASH_ADVANCED: 'account/cash/advanced', // 发起预支押金的动作
    _ACCOUNT_CASH_WALLET_REPAY: 'account/cash/repay', // 向预支账户或罚息账户还款
    _MERCHANT_BANK_ACCOUNT: 'merchant/bankAccount', // 获取商户结算账户信息
    _ACCOUNT_GOLD_BUY_POST: 'account/gold/buy', // 买入黄金
    _ACCOUNT_GOLD_SELL_POST: 'account/gold/sell', // 卖出黄金
    _ACCOUNT_GOLD_STAT_LIST: 'account/gold/stat', // 黄金的交易明细
    _ACCOUNT_GOLD_GET: 'account/gold', // 获取黄金类账户
    _ACCOUNT_TRAN: 'account/tran', // 获取账户的动账记录
    _PROMO_RETAIL_GOLD_RECORD: 'promo/retail/gold/record', // 黄金赠送明细
    _PROMO_RETAIL_GOLD_RULE: 'promo/retail/gold/rule', // 黄金赠送规则 （获取，新增）
    _PROMO_RETAIL_GOLD_RULE_BY_ID: 'promo/retail/gold/rule/{ruleId}', // 黄金赠送规则 （修改，删除）
    // 模板管理
    _GOODS_PRINT_TEMPLATE_LABEL_LIST: 'goods/print/template/label', // 获取标签的打印模板
    _GOODS_PRINT_TEMPLATE_LABEL_ADD: 'goods/print/template/label', // 新增标签的打印模板
    _GOODS_PRINT_TEMPLATE_LABEL_DEL: 'goods/print/template/label/{templateId}', // 删除标签的打印模板
    _GOODS_PRINT_TEMPLATE_LABEL_PUT: 'goods/print/template/label/{templateId}', // 修改标签的打印模板

    _GOODS_RECEIPT_TEMPLATE_LIST: 'goods/print/template/receipt', // 获取小票的打印模板
    _GOODS_RECEIPT_TEMPLATE_POST: 'goods/print/template/receipt', // 添加小票的打印模板
    _GOODS_RECEIPT_TEMPLATE_DEL: 'goods/print/template/receipt/{templateId}', // 删除小票的打印模板
    _GOODS_RECEIPT_TEMPLATE_MODIFY: 'goods/print/template/receipt/{templateId}', // 修改小票的打印模板
    // 卡券设置
    _COUPON_RULE_SET: 'promo/coupon/toBuy/rule', // 获取卡券统计,设置规则
    _ACCOUNT_COUPON_STAT: 'account/coupon/stat', // 获取卡券统计
    _PROMO_COUPON_TOBUY_RULE: 'promo/coupon/toBuy/rule/{ruleId}', // 修改、删除转买券的发放规则
    // 用户统计
    _MERCHANT_CUSTOMER: 'merchant/customer', // 获取商户的用户列表
    _MERCHANT_CUSTOMER_GROWTH: 'merchant/customer/growth', // 获取商户的用户增长情况
    _MERCHANT_CUSTOMER_STAT: 'merchant/customer/stat', // 获取商户的用户统计
    _MERCHANT_CUSTOMER_STAT_REGION: 'merchant/customer/stat/region', // 获取商户的用户统计·按地区汇总
    _MERCHANT_CUSTOMER_STAT_REGION_DETAIL: 'merchant/customer/stat/region/detail', // 获取商户的用户列表·按地区、按状类型
    // 个人绩效
    _REPORT_PERFORMANCE_STAT: 'report/performance/stat', // 获取员工业绩统计表
    _REPORT_PERFORMANCE_PACKAGE: 'report/performance/package', // 获取,添加业绩等效项列表
    _REPORT_PERFORMANCE_PACKAGE_MODIFY: 'report/performance/package/{packageId}', // 删除，修改业绩等效项
    _REPORT_PERFORMANCE_TEAM_SHARE_RULE: 'report/performance/teamShareRule', // 获取，设置多人业绩分配规则

    // 消息通知
    _GET_MESSAGE_TEMPLATE: 'message/template', // 获取 添加消息模板
    _POST_MESSAGE_TEMPLATE_IMAGE: 'message/template/image', // 向消息模板添加图片
    _POST_MESSAGE_TEMPLATE_SEND: 'message/template/send', // 发送模板消息
    _GET_MESSAGE_TEMPLATE_SEND_RECORD: 'message/template/send/record', // 获取模板消息发送记录
    _DEL_MESSAGE_TEMPLATE_IMAGE: 'message/template/image/{imageId}', // 从消息模板中删除图片
    _MODIFY_MESSAGE_TEMPLATE_BY_ID: 'message/template/{templateId}', // 修改 删除消息模板
    _GET_MERCHANT_CUSTOMER_COUNT: 'merchant/customer/count' // 查询商户的用户数

}
