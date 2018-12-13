export default {
    // 零售计价方式
    _CONST_RETAIL_PRICE_TYPE: [
        {name: '按重计算', value: 'WEIGHTED'},
        {name: '指定价格', value: 'FIXED'}
    ],
    // 成本算法
    _CONST_COST_PRICE_ALGORITHM: [
        {name: '自动计算（按重）', value: 'WEIGHT'},
        {name: '手动输入', value: 'INPUT'}
    ],
    // 销售算法
    _CONST_RETAIL_PRICE: [
        {name: '自动计算（按重）', value: 'WEIGHTED'}, // 今日金价
        {name: '手动输入', value: 'FIXED'}
    ],
    // 售价算法
    _CONST_RETAIL_PRICE_ALGORITHM: [
        {name: '今日金价', value: 'TODAY_METAL_PRICE'},
        {name: '指定金价', value: 'FIXED_METAL_PRICE'},
        {name: '成本倍率', value: 'COST_BONUS'}
    ],
    // 特价、镶嵌时的售价算法
    _CONST_BAGAIN_PRICE_ALGORITHM: [
        {name: '手动输入', value: 'INPUT'},
        {name: '成本倍率', value: 'COST_BONUS'}
    ],
    // 采购方式
    _CONST_STOCK_TYPE: [
        {name: '购买', value: 'BUY'},
        {name: '租赁', value: 'BORROW'}
    ],
    // 入库单据类型(区分是否入库)
    _CONST_STOCK_TYPE_IN_OR_OUT: [
        {name: '采购入库', id: 'STOCK_IN', isIn: true},
        {name: '采购退货', id: 'STOCK_REJECT', isIn: false},
        {name: '调拨出库', id: 'ALLOCATE_OUT', isIn: false},
        {name: '调拨入库', id: 'ALLOCATE_IN', isIn: true},
        {name: '调拨拒收入库', id: 'ALLOCATE_REJECT_IN', isIn: true},
        {name: '盘点报损', id: 'INVENTORY_LOSS', isIn: false},
        {name: '盘点报溢', id: 'INVENTORY_OVER_FLOW', isIn: true},
        {name: '补录质保单', id: 'CONSUME_OUT', isIn: false},
        {name: '销售出库', id: 'RETAIL_OUT', isIn: false},
        {name: '销售退货', id: 'RETAIL_REJECT', isIn: true},
        {name: '回收入库', id: 'RECYCLE_IN', isIn: true},
        {name: '置换入库', id: 'EXCHANGE_IN', isIn: true},
        {name: '试戴出库', id: 'LEASE_OUT', isIn: false},
        {name: '试戴转买', id: 'LEASE_TO_BUY', isIn: false},
        {name: '试戴拒收入库', id: 'LEASE_REJECT_IN', isIn: true},
        {name: '试戴还货入库', id: 'LEASE_BACK', isIn: true},
        {name: '提实物金', id: 'PHYSICAL_GOLD_BILL', isIn: false}
    ],
    // 入库单状态
    _CONST_PROCUREMENT_BILL_TYPE: [
        {name: '待提交', value: 'TO_SUBMIT'},
        {name: '待审批', value: 'TO_AUDIT'},
        {name: '审批不通过', value: 'AUDIT_DECLINED'},
        {name: '审批通过', value: 'AUDIT_APPROVED'}
    ],
    // 重量单位
    _CONST_WEIGHT_UNIT: [
        {name: '克', value: 'g'},
        {name: '克拉', value: 'ct'}
    ],
    // 库存方式
    _CONST_SKU_TYPE: [
        {name: '单款单件', value: 'SINGLE'},
        {name: '单款多件', value: 'MULTI'}
    ],
    // 商品类型
    _CONST_WARE_TYPE: [
        {name: '素金', value: 'PURE'},
        {name: '镶嵌', value: 'MIXED'}
    ],
    // 库存商品采购方式
    _CONST_WARE_GETTYPE: [
        {name: '买入', value: 'BUY'},
        {name: '借入', value: 'BORROW'}
    ],
    // 库存商品采购方式
    _CONST_WARE_GETTYPE_ID: [
        {name: '买入', id: 'BUY'},
        {name: '借入', id: 'BORROW'}
    ],
    // 盘点单状态
    _CONST_INVENTORY_TYPE: [
        {name: '未完成', value: 'TO_SUBMIT'},
        {name: '待审核', value: 'TO_AUDIT'},
        {name: '审核未通过', value: 'AUDIT_DECLINED'},
        {name: '已清算处理', value: 'AUDIT_APPROVED'}
    ],
    // 盘点单盈亏状态
    _CONST_INVENTORY_LOSSORGAIN_TYPE: [
        {name: '有盈亏', value: 'false'},
        {name: '正常', value: 'true'}
    ],
    // 退货单状态
    _CONST_RETURN_BILL_TYPE: [
        {name: '待提交', value: 'TO_SUBMIT'},
        {name: '待审批', value: 'TO_AUDIT'},
        {name: '审批不通过', value: 'AUDIT_DECLINED'},
        {name: '审批通过', value: 'AUDIT_APPROVED'}
    ],
    // 用户性别
    _CONST_USER_GENDER: [
        {name: '女', value: 'FEMALE'},
        {name: '男', value: 'MALE'}
    ],
    // 收银单类型
    _CONST_PAYMENT_TYPE: [
        {name: '商品入库', value: 'STOCK_IN'},
        {name: '商品拒收', value: 'STOCK_REJECT'},
        {name: '商品出库', value: 'ALLOCATE_OUT'},
        {name: '商品入库', value: 'ALLOCATE_IN'},
        {name: '商品入库被拒', value: 'ALLOCATE_REJECT_IN'},
        {name: '盘亏', value: 'INVENTORY_LOSS'},
        {name: '盘盈', value: 'INVENTORY_OVER_FLOW'},
        {name: '商品销售', value: 'RETAIL_OUT'},
        {name: '销售被拒', value: 'RETAIL_REJECT'},
        {name: '商品', value: 'RECYCLE_IN'},
        {name: '商品置换入库', value: 'EXCHANGE_IN'}
    ],
    // 付款状态
    _CONST_PAID_TYPE: [
        {name: '未付款', value: 'false'},
        {name: '已付款', value: 'true'}
    ],
    // 审批单据类型
    _CONST_AUDIT_TYPE: [
        {name: '采购入库单', value: 'GOODS_STOCK'},
        {name: '采购退货单', value: 'GOODS_STOCK_REJECT'},
        {name: '盘点单', value: 'GOODS_INVENTORY'},
        {name: '商品修改单', value: 'GOODS_STORAGE_EDIT'} // 不确定
    ],
    // 审批单据审核情况
    _CONST_AUDIT_STATUS: [
        {name: '待审核', value: 'WAIT_AUDIT'},
        {name: '审核中', value: 'AUDITING'},
        {name: '已通过', value: 'APPROVED'},
        {name: '已拒绝', value: 'DECLINED'}
    ],
    // 试戴状态
    _CONST_LEASE_STATUS: [
        {name: '待上架', id: 'PENDING'},
        {name: '已上架', id: 'ON'},
        {name: '已下架', id: 'OFF'}
    ],
    // 黄金赠送规则中的计价方式
    // all, weighted, fixed, bargainPrice
    _CONST_PRESENT_GOLD_PRICE_TYPE: [
        {name: '按重', id: 'weighted'},
        {name: '原价', id: 'fixed'},
        {name: '折扣价', id: 'bargainPrice'}
    ],
    // 标签模板的计价方式
    _CONST_PRINT_PRICE_TYPE: [
        {name: '按重计价', id: 'WEIGHTED'},
        {name: '正常定价', id: 'FIXED'},
        {name: '折扣价', id: 'BARGAIN'}
    ],
    // 等效项设置的定价方式
    _CONST_EQUIVALENT_PRICE_TYPE: [
        {name: '按重计价', id: 'WEIGHTED'},
        {name: '定价(无优惠价)', id: 'FIXED'},
        {name: '定价(有优惠价)', id: 'BARGAINPRICE'}
    ],
    // 快递
    _CONST_SHIPPER: [
        {name: '顺丰速运', id: 'SF'},
        {name: '京东物流', id: 'JD'}
    ],
    // 用户分类
    _CONST_USER_TYPE: [
        {name: '注册用户', id: 'ALL'},
        {name: '零售用户', id: 'RETAIL'},
        {name: '试戴用户', id: 'LEASE'},
        {name: '转买用户', id: 'LEASE_TO_BUY'},
        {name: '未消费用户', id: 'NONE'}
    ],
    // 等效项（业务类型--完整版）
    _CONST_BUSINESS_TYPE: [
        {name: '线下常规零售', id: 'RETAIL_RETAIL'},
        {name: '线下置换销售', id: 'RETAIL_EXCHANGE'},
        {name: '线上转买', id: 'LEASE_BUY'}
    ],
    // 等效项（业务类型--简版版）
    _CONST_BUSINESS_TYPE_SMART: [
        {name: '线下常规零售', id: 'RETAIL_RETAIL'},
        {name: '线上转买', id: 'LEASE_BUY'}
    ],
    // 等效项（是否素金）
    _CONST_WARES_TYPE_EQUIVALENT: [
        {name: '素金', id: 'PURE'},
        {name: '非素', id: 'MIXED'}
    ],
    // 等效项（精品或是普货）
    _CONST_PROCESSING_TYPE: [
        {name: '普货', id: 'NORMAL'},
        {name: '精品', id: 'HIGH'}
    ],
    _CONST_NOTICE_CONSUME_TYPE: [
        {name: '线下零售', id: 'RETAIL'},
        {name: '线上试戴', id: 'LEASE'},
        {name: '转买', id: 'LEASE_TO_BUY'}
    ],
    _CONST_SEND_NOTICE_ITEM: [
        {name: '对选中对象发送', id: 'CHOOSE'},
        {name: '对当前页对象发送', id: 'CURRENT'},
        {name: '对筛选结果发送', id: 'ALL'}
    ]
}
