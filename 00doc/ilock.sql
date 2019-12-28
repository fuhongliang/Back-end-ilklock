/*
 Navicat Premium Data Transfer

 Source Server         : 本地环境
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : ilock

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 28/12/2019 16:52:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ilock_admin
-- ----------------------------
DROP TABLE IF EXISTS `ilock_admin`;
CREATE TABLE `ilock_admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `level` int(1) NOT NULL DEFAULT 0 COMMENT '0超管 1普通管理员',
  `roleid` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `is_delete` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_aly_sms
-- ----------------------------
DROP TABLE IF EXISTS `ilock_aly_sms`;
CREATE TABLE `ilock_aly_sms`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_key_id` varchar(0) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '阿里云短信accessKeyId',
  `access_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '阿里云短信accessSecret',
  `sign_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '阿里云短信签名',
  `sms_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '短信验证码模板',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_apply_authorize
-- ----------------------------
DROP TABLE IF EXISTS `ilock_apply_authorize`;
CREATE TABLE `ilock_apply_authorize`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '关联企业',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '申请人/被授权人 user表',
  `lock_id` int(11) NOT NULL DEFAULT 0 COMMENT '锁id',
  `group_id` int(11) NOT NULL DEFAULT 0 COMMENT '分组id',
  `audit_id` int(11) NOT NULL DEFAULT 0 COMMENT '审核人id user表',
  `secret_key` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '开锁指令',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '申请时间',
  `duration` int(255) NOT NULL DEFAULT 0 COMMENT '过期时长 ( 小时 )',
  `expiry_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '过期时间',
  `type` int(1) NOT NULL DEFAULT 0 COMMENT '0用户申请  1管理员主动授权',
  `status` int(2) NOT NULL DEFAULT 0 COMMENT '-1拒绝 0待处理 1待发放 2指令已发放 3已完成',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_apply_authorize
-- ----------------------------
INSERT INTO `ilock_apply_authorize` VALUES (1, 1, 1, 1, 0, 1, '11111', 1577167003000, 0, 1577167555000, 0, 1, 0);

-- ----------------------------
-- Table structure for ilock_group
-- ----------------------------
DROP TABLE IF EXISTS `ilock_group`;
CREATE TABLE `ilock_group`  (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '分组命名',
  `locks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '锁列表json数据',
  `expire_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '过期时间',
  `type` int(1) NOT NULL DEFAULT 0 COMMENT '0单个锁  1分组开锁',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_lock
-- ----------------------------
DROP TABLE IF EXISTS `ilock_lock`;
CREATE TABLE `ilock_lock`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '所属企业id',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '锁名称',
  `lock_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '锁编号',
  `region_id` int(11) NOT NULL DEFAULT 0 COMMENT '区域id',
  `is_check` int(1) NOT NULL DEFAULT 0 COMMENT '-1拒绝 0待审核 1审核成功',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_lock
-- ----------------------------
INSERT INTO `ilock_lock` VALUES (1, 1, '1号锁', '12345678', 12, 1, 0, 0);
INSERT INTO `ilock_lock` VALUES (2, 1, '2号锁', '111222', 16, 0, 0, 0);

-- ----------------------------
-- Table structure for ilock_lock_log
-- ----------------------------
DROP TABLE IF EXISTS `ilock_lock_log`;
CREATE TABLE `ilock_lock_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lock_id` int(11) NOT NULL DEFAULT 0 COMMENT '锁id',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户id',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '操作时间',
  `status` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '读码' COMMENT '操作',
  `is_delete` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_lock_log
-- ----------------------------
INSERT INTO `ilock_lock_log` VALUES (1, 1, 1, 0, '读码', 0);

-- ----------------------------
-- Table structure for ilock_mch
-- ----------------------------
DROP TABLE IF EXISTS `ilock_mch`;
CREATE TABLE `ilock_mch`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '企业名称',
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '企业联系人',
  `phone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '联系电话',
  `address` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '联系地址',
  `is_checked` int(1) NOT NULL DEFAULT 0 COMMENT '-1审核失败  0待审核 1通过审核',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_mch
-- ----------------------------
INSERT INTO `ilock_mch` VALUES (1, '艾乐科科技有限公司', '符红梁', '18825110997', '广东省珠海市香洲区', 1, 0);

-- ----------------------------
-- Table structure for ilock_permission
-- ----------------------------
DROP TABLE IF EXISTS `ilock_permission`;
CREATE TABLE `ilock_permission`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
  `alias_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '权限别称',
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限路由',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_permission
-- ----------------------------
INSERT INTO `ilock_permission` VALUES (1, '区域管理', 'qygl', '/region/locks');
INSERT INTO `ilock_permission` VALUES (2, '区域设置', 'qysz', '/region/setting');
INSERT INTO `ilock_permission` VALUES (3, '开锁授权', 'kssq', '/apply/list');
INSERT INTO `ilock_permission` VALUES (4, '查看记录', 'ckjl', '/operate-list');
INSERT INTO `ilock_permission` VALUES (5, '人员管理', 'rygl', '/users');
INSERT INTO `ilock_permission` VALUES (6, '角色管理', 'jsgl', '/role/list');
INSERT INTO `ilock_permission` VALUES (7, '开锁设置', 'kssz', '/group/list');

-- ----------------------------
-- Table structure for ilock_permission_role
-- ----------------------------
DROP TABLE IF EXISTS `ilock_permission_role`;
CREATE TABLE `ilock_permission_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL DEFAULT 0 COMMENT '角色id',
  `permissionid` int(11) NOT NULL DEFAULT 0 COMMENT '权限id',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_permission_role
-- ----------------------------
INSERT INTO `ilock_permission_role` VALUES (1, 1, 1, 0);
INSERT INTO `ilock_permission_role` VALUES (2, 1, 2, 0);
INSERT INTO `ilock_permission_role` VALUES (3, 1, 3, 0);
INSERT INTO `ilock_permission_role` VALUES (4, 1, 4, 0);
INSERT INTO `ilock_permission_role` VALUES (5, 1, 5, 0);
INSERT INTO `ilock_permission_role` VALUES (6, 1, 6, 0);
INSERT INTO `ilock_permission_role` VALUES (7, 1, 7, 0);

-- ----------------------------
-- Table structure for ilock_region
-- ----------------------------
DROP TABLE IF EXISTS `ilock_region`;
CREATE TABLE `ilock_region`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '关联企业',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '区域名称',
  `parent_id` int(11) NOT NULL DEFAULT 0 COMMENT '父级区域id',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_region
-- ----------------------------
INSERT INTO `ilock_region` VALUES (1, 1, '东区', 0, 0);
INSERT INTO `ilock_region` VALUES (2, 1, '南区', 0, 0);
INSERT INTO `ilock_region` VALUES (3, 1, '北区', 0, 0);
INSERT INTO `ilock_region` VALUES (4, 1, '西区', 0, 0);
INSERT INTO `ilock_region` VALUES (5, 1, '东区一街', 1, 0);
INSERT INTO `ilock_region` VALUES (6, 1, '东区二街', 1, 0);
INSERT INTO `ilock_region` VALUES (7, 1, '东区三街', 1, 0);
INSERT INTO `ilock_region` VALUES (8, 1, '东区四街', 1, 0);
INSERT INTO `ilock_region` VALUES (9, 1, '东区一街5巷', 5, 0);
INSERT INTO `ilock_region` VALUES (10, 1, '东区一街6巷', 5, 0);
INSERT INTO `ilock_region` VALUES (11, 1, '东区二街3巷', 6, 0);
INSERT INTO `ilock_region` VALUES (12, 1, '东区二街6巷', 6, 0);
INSERT INTO `ilock_region` VALUES (13, 1, '东区三街4巷', 7, 0);
INSERT INTO `ilock_region` VALUES (14, 1, '东区四街1巷', 8, 0);
INSERT INTO `ilock_region` VALUES (15, 1, '南区二街', 2, 0);
INSERT INTO `ilock_region` VALUES (16, 1, '西区三街', 4, 0);
INSERT INTO `ilock_region` VALUES (17, 1, '北区二街', 3, 0);

-- ----------------------------
-- Table structure for ilock_role
-- ----------------------------
DROP TABLE IF EXISTS `ilock_role`;
CREATE TABLE `ilock_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '关联企业',
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '角色名称',
  `desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '角色描述',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '添加时间',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_role
-- ----------------------------
INSERT INTO `ilock_role` VALUES (1, 1, '管理员', '哈哈哈哈', 0, 0);
INSERT INTO `ilock_role` VALUES (2, 1, '用户', '哈哈哈哈', 0, 0);

-- ----------------------------
-- Table structure for ilock_secret
-- ----------------------------
DROP TABLE IF EXISTS `ilock_secret`;
CREATE TABLE `ilock_secret`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `secret_key` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '开锁指令',
  `start_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '开锁开始时间',
  `expire_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '指令过期时间',
  `is_send` int(1) NOT NULL DEFAULT 0 COMMENT '1 指令已发放',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1 删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_user
-- ----------------------------
DROP TABLE IF EXISTS `ilock_user`;
CREATE TABLE `ilock_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '所属企业id',
  `username` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `job_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '工号',
  `level` int(2) NOT NULL DEFAULT 1 COMMENT '0超级管理员 1普通管理员',
  `roleid` int(11) NOT NULL DEFAULT 0 COMMENT '角色id',
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '姓名',
  `pinyin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '姓名拼音',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '创建时间',
  `review_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '审核时间',
  `phone` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1已删除',
  `is_check` int(1) NOT NULL DEFAULT 0 COMMENT '-1审核失败 0待审核 1通过审核',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  INDEX `mch_id`(`mch_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_user
-- ----------------------------
INSERT INTO `ilock_user` VALUES (1, 1, '13728202087', '7c4a8d09ca3762af61e59520943dc26494f8941b', '1008610', 0, 0, '刘燕家', 'lyj', 1, 0, '13728202087', 0, 1);
INSERT INTO `ilock_user` VALUES (2, 1, '1008611', '7205db181158aa3dfc55d22fe521f447ca2e5777', '1008611', 1, 1, 'hhh', 'hhh', 0, 0, '1008611', 0, 1);
INSERT INTO `ilock_user` VALUES (3, 1, '10000', '8a12a315082a345f1a9d3ad14b214cd36d310cf8', '10000', 1, 2, 'lll', 'lll', 0, 0, '10000', 0, 1);

-- ----------------------------
-- Table structure for ilock_user_permission
-- ----------------------------
DROP TABLE IF EXISTS `ilock_user_permission`;
CREATE TABLE `ilock_user_permission`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户id',
  `permission_id` int(11) NOT NULL DEFAULT 0 COMMENT '用户权限id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_wechat_app
-- ----------------------------
DROP TABLE IF EXISTS `ilock_wechat_app`;
CREATE TABLE `ilock_wechat_app`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '小程序APPID',
  `appsecret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '小程序secret',
  `ddd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_wechat_app
-- ----------------------------
INSERT INTO `ilock_wechat_app` VALUES (1, '111', 'kkk', NULL);
INSERT INTO `ilock_wechat_app` VALUES (2, '111', 'kkk', NULL);
INSERT INTO `ilock_wechat_app` VALUES (3, '111', 'kkk', NULL);
INSERT INTO `ilock_wechat_app` VALUES (4, '111', 'kkk', NULL);
INSERT INTO `ilock_wechat_app` VALUES (5, '111', 'kkk', NULL);

-- ----------------------------
-- Table structure for ilock_wx_account
-- ----------------------------
DROP TABLE IF EXISTS `ilock_wx_account`;
CREATE TABLE `ilock_wx_account`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '微信昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '微信头像',
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '微信用户唯一标识',
  `unionid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '微信用户在开放平台的唯一标识符',
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '绑定用户信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ilock_wx_account
-- ----------------------------
INSERT INTO `ilock_wx_account` VALUES (1, '#', 'https://wx.qlogo.cn/mmopen/vi_32/AbiaTMqpnkIMF7PIKJ5jfg1sZpLbjeUJMnnYDrHkNeeib8ib1qWgSmicSm9MAicwCWFFicc0WM6IpY9TnwxL9zNeXbeg/132', 'oErKB4lQh2G0AbMzo1elxtRGzlK4', 'o3M_Pt62AAF8iboEwnSPbToxY29Y', 1);

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
