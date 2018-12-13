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
        {name: '自动计算（按重）', value: 'WEIGHTED'},
        {name: '手动输入', value: 'FIXED'}
    ],
    // 售价算法
    _CONST_RETAIL_PRICE_ALGORITHM: [
        {name: '今日金价', value: 'TODAY_METAL_PRICE'},
        {name: '指定金价', value: 'FIXED_METAL_PRICE'},
        {name: '成本倍率', value: 'COST_BONUS'}
    ],
    // 采购方式
    _CONST_STOCK_TYPE: [
        {name: '购买', value: 'BUY'},
        {name: '租赁', value: 'BORROW'}
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
    // 入库单类型
    _CONST_ALLOCATE_TYPE: [
        {name: '采购入库XX', value: 'STOCK_IN'},
        {name: '入库返回XX', value: 'STOCK_REJECT'},
        {name: '出库XX', value: 'ALLOCATE_OUT'},
        {name: '入库XX', value: 'ALLOCATE_IN'},
        {name: '被拒XX', value: 'ALLOCATE_REJECT_IN'},
        {name: '损失XX', value: 'INVENTORY_LOSS'},
        {name: '盘点XXX', value: 'INVENTORY_OVER_FLOW'}
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
    ]
}
