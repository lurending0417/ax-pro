import Vue from 'vue'
import {DateRange, EnumRadio, EnumSelect, HistoryView, Loading, Pagination, RegionSelect, UserProfile} from '../components/common'
import {Merchant, MerchantBankAccountEditor, MerchantBasicInfo, MerchantEditor, MerchantView, Store} from "../components/merchant"
import {Category, CategoryEditor, Craft, CraftEditor, Gem, GemEditor, Metal, MetalEditor, MetaPropEditor, MetaPropList} from "../components/meta"
import {ActionEditor, ActionGroupEditor, ActionTree, AdminPageEditor, AdminPageGroupEditor, AdminPageTree, AdminRoleEditor, AdminRoleGroupEditor, AdminRoleTree, AdminTabEditor, DutyEditor, DutyTpl, PageEditor, PageGroupEditor, PageTree, RoleEditor, RoleGroupEditor, RoleTplTree, TabEditor} from "../components/auth"
import {RandSms, SmsGatewayAccount, SmsGatewayAccountEditor, SmsGatewayRecord, SmsGatewayRouter, SmsGatewayRouterEditor, SmsTemplate, SmsTemplateEditor, TemplateSms} from "../components/sms";
import {PhysicalGold, PhysicalGoldBill, PhysicalGoldBillView, PhysicalGoldEditor} from "../components/physical";
import {CashDailyStat, CashStat, DepositStat, GoldStat, IncomeStat, LeaseStat, LeaseStatDetail, MerchantWalletStat, UserWalletStat, WalletStat} from "../components/report/index";
import {IndexBanner, IndexBannerEditor, IndexScene, IndexSceneBanner, IndexSceneBannerEditor, IndexSceneContent, IndexSceneContentEditor, IndexSceneEditor, IndexSceneStorage, IndexSceneStorageEditor} from "../components/page/index";
import {PlatEmployee, PlatEmployeeEditor} from "../components/arch";
import {Account, EncourageRecordDialog, EncourageRecordEditor, EncourageTran, GoldBuyRecord, GoldSellRecord, MarketingTran, MutableTran, RechargeWallet, RechargeWalletDialog, RechargeWalletOffline, RechargeWalletOfflineDialog, WalletTran, WithdrawRecord, WithdrawTran, WithdrawTransfer} from "../components/account";
import {Job} from "../components/job";
import {LeaseRecord, LeaseRecordView} from "../components/lease";
import {User, UserBasicInfo, UserView} from "../components/user";
import {RentRule} from "../components/config";


Vue.use(RegionSelect);
Vue.use(Loading);
Vue.use(HistoryView);
Vue.use(Pagination);
Vue.use(EnumSelect);
Vue.use(EnumRadio);
Vue.use(DateRange);


Vue.use(Store);
Vue.use(Merchant);
Vue.use(MerchantEditor);
Vue.use(MerchantBankAccountEditor);
Vue.use(MerchantView);
Vue.use(MerchantBasicInfo);

Vue.use(Metal);
Vue.use(MetalEditor);
Vue.use(Gem);
Vue.use(GemEditor);
Vue.use(Category);
Vue.use(CategoryEditor);
Vue.use(Craft);
Vue.use(CraftEditor);
Vue.use(MetaPropList);
Vue.use(MetaPropEditor);

Vue.use(ActionTree);
Vue.use(ActionGroupEditor);
Vue.use(ActionEditor);

Vue.use(PageTree);
Vue.use(PageGroupEditor);
Vue.use(PageEditor);
Vue.use(TabEditor);
Vue.use(RoleTplTree);
Vue.use(RoleGroupEditor);
Vue.use(RoleEditor);
Vue.use(DutyTpl);
Vue.use(DutyEditor);

Vue.use(AdminPageTree);
Vue.use(AdminPageGroupEditor);
Vue.use(AdminPageEditor);
Vue.use(AdminTabEditor);

Vue.use(AdminRoleTree);
Vue.use(AdminRoleGroupEditor);
Vue.use(AdminRoleEditor);


Vue.use(RandSms);
Vue.use(TemplateSms);
Vue.use(SmsGatewayAccount);
Vue.use(SmsTemplate);
Vue.use(SmsGatewayRouter);
Vue.use(SmsGatewayRecord);
Vue.use(SmsGatewayAccountEditor);
Vue.use(SmsGatewayRouterEditor);
Vue.use(SmsTemplateEditor);


Vue.use(LeaseRecord);
Vue.use(LeaseRecordView);

Vue.use(PhysicalGold);
Vue.use(PhysicalGoldEditor);
Vue.use(PhysicalGoldBill);
Vue.use(PhysicalGoldBillView);


Vue.use(CashStat);
Vue.use(CashDailyStat);
Vue.use(DepositStat);
Vue.use(GoldStat);
Vue.use(IncomeStat);
Vue.use(LeaseStat);
Vue.use(LeaseStatDetail);
Vue.use(WalletStat);
Vue.use(UserWalletStat);
Vue.use(MerchantWalletStat);


Vue.use(IndexBanner);
Vue.use(IndexBannerEditor);

Vue.use(IndexScene);
Vue.use(IndexSceneEditor);
Vue.use(IndexSceneBanner);
Vue.use(IndexSceneBannerEditor);
Vue.use(IndexSceneContent);
Vue.use(IndexSceneContentEditor);
Vue.use(IndexSceneStorage);
Vue.use(IndexSceneStorageEditor);


Vue.use(PlatEmployee);
Vue.use(PlatEmployeeEditor);


Vue.use(Account);
Vue.use(WalletTran);
Vue.use(MarketingTran);
Vue.use(MutableTran);
Vue.use(EncourageTran);
Vue.use(GoldBuyRecord);
Vue.use(GoldSellRecord);
Vue.use(RechargeWallet);
Vue.use(RechargeWalletDialog);
Vue.use(RechargeWalletOffline);
Vue.use(RechargeWalletOfflineDialog);
Vue.use(EncourageRecordDialog);
Vue.use(EncourageRecordEditor);
Vue.use(WithdrawRecord);
Vue.use(WithdrawTran);
Vue.use(WithdrawTransfer);


Vue.use(User);
Vue.use(UserView);
Vue.use(UserBasicInfo);
Vue.use(UserProfile);

Vue.use(Job);

Vue.use(RentRule);
