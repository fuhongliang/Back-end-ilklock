/*
 Navicat MySQL Data Transfer

 Source Server         : 本地环境
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : ilock

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 24/12/2019 09:09:06
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
  `user_id` int(11) NOT NULL DEFAULT 0 COMMENT '申请人/被授权人',
  `lock_id` int(11) NOT NULL DEFAULT 0 COMMENT '锁id',
  `group_id` int(11) NOT NULL DEFAULT 0 COMMENT '分组id',
  `secret_key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '开锁指令',
  `expiry_time` bigint(20) NOT NULL DEFAULT 0 COMMENT '过期时间',
  `type` int(1) NOT NULL COMMENT '0用户申请  1管理员主动授权',
  `status` int(2) NOT NULL DEFAULT 0 COMMENT '-1拒绝 0待处理 1待发放 2指令已发放',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
-- Table structure for ilock_permission
-- ----------------------------
DROP TABLE IF EXISTS `ilock_permission`;
CREATE TABLE `ilock_permission`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限名称',
  `route` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '权限路由',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_region
-- ----------------------------
DROP TABLE IF EXISTS `ilock_region`;
CREATE TABLE `ilock_region`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '关联企业',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '区域名称',
  `parent_id` int(11) NOT NULL COMMENT '父级区域id',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ilock_role
-- ----------------------------
DROP TABLE IF EXISTS `ilock_role`;
CREATE TABLE `ilock_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mch_id` int(11) NOT NULL DEFAULT 0 COMMENT '关联企业',
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '角色名称',
  `addtime` bigint(20) NOT NULL DEFAULT 0 COMMENT '添加时间',
  `is_delete` int(1) NOT NULL DEFAULT 0 COMMENT '1删除',
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
