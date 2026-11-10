-- ============================================================
-- 星溯智能科技 (StellarTrace) 官网后台管理系统 - 数据库脚本
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `stellar_trace` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `stellar_trace`;

-- ============================================================
-- 1. 用户表 (sys_user)
-- ============================================================
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(50) NOT NULL COMMENT '用户名/账号',
  `password` varchar(255) NOT NULL COMMENT '密码(BCrypt加密)',
  `nickname` varchar(50) DEFAULT '' COMMENT '昵称',
  `avatar` varchar(255) DEFAULT '' COMMENT '头像URL',
  `email` varchar(100) DEFAULT '' COMMENT '邮箱',
  `phone` varchar(20) DEFAULT '' COMMENT '手机号',
  `role` varchar(20) DEFAULT 'admin' COMMENT '角色: admin/editor/viewer',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-禁用 1-启用',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- ============================================================
-- 2. 首页横幅表 (cms_home_banner)
-- ============================================================
DROP TABLE IF EXISTS `cms_home_banner`;
CREATE TABLE `cms_home_banner` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(200) NOT NULL COMMENT '主标题',
  `subtitle` varchar(200) DEFAULT '' COMMENT '英文副标题',
  `description` text COMMENT '描述文字',
  `btn_text_1` varchar(50) DEFAULT '' COMMENT '按钮1文字',
  `btn_link_1` varchar(255) DEFAULT '' COMMENT '按钮1链接',
  `btn_text_2` varchar(50) DEFAULT '' COMMENT '按钮2文字',
  `btn_link_2` varchar(255) DEFAULT '' COMMENT '按钮2链接',
  `bg_image` varchar(255) DEFAULT '' COMMENT '背景图片URL',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页横幅表';

-- ============================================================
-- 3. 创始人表 (cms_founder)
-- ============================================================
DROP TABLE IF EXISTS `cms_founder`;
CREATE TABLE `cms_founder` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `title` varchar(200) DEFAULT '' COMMENT '职位/头衔',
  `avatar` varchar(255) DEFAULT '' COMMENT '头像URL',
  `profile_link` varchar(255) DEFAULT '' COMMENT '个人主页链接',
  `intro` text COMMENT '简介/寄语内容(支持多段)',
  `mission` varchar(500) DEFAULT '' COMMENT '使命宣言',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='创始人表';

-- ============================================================
-- 4. 核心技术表 (cms_core_tech)
-- ============================================================
DROP TABLE IF EXISTS `cms_core_tech`;
CREATE TABLE `cms_core_tech` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '技术名称',
  `description` varchar(500) DEFAULT '' COMMENT '技术描述',
  `icon` varchar(50) DEFAULT '' COMMENT 'Font Awesome图标类名',
  `color_from` varchar(20) DEFAULT '' COMMENT '渐变色起始色',
  `color_to` varchar(20) DEFAULT '' COMMENT '渐变色结束色',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='核心技术表';

-- ============================================================
-- 5. 星际AI能力表 (cms_ai_capability)
-- ============================================================
DROP TABLE IF EXISTS `cms_ai_capability`;
CREATE TABLE `cms_ai_capability` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '能力名称',
  `description` varchar(500) DEFAULT '' COMMENT '能力描述',
  `icon` varchar(50) DEFAULT '' COMMENT 'Font Awesome图标类名',
  `color_from` varchar(20) DEFAULT '' COMMENT '渐变色起始色',
  `color_to` varchar(20) DEFAULT '' COMMENT '渐变色结束色',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='星际AI能力表';

-- ============================================================
-- 6. AI数据看板表 (cms_ai_dashboard)
-- ============================================================
DROP TABLE IF EXISTS `cms_ai_dashboard`;
CREATE TABLE `cms_ai_dashboard` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `value` varchar(50) NOT NULL COMMENT '数值(如 138、2T+、5000+)',
  `label` varchar(100) DEFAULT '' COMMENT '标签说明',
  `color` varchar(20) DEFAULT '' COMMENT '数值文字颜色',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI数据看板表';

-- ============================================================
-- 7. 意象解析表 (cms_metaphor)
-- ============================================================
DROP TABLE IF EXISTS `cms_metaphor`;
CREATE TABLE `cms_metaphor` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `cosmic_element` varchar(100) NOT NULL COMMENT '宇宙元素',
  `tech_mapping` varchar(200) DEFAULT '' COMMENT '技术映射',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='意象解析表';

-- ============================================================
-- 8. 意象解析-设计意图表 (cms_metaphor_design)
-- ============================================================
DROP TABLE IF EXISTS `cms_metaphor_design`;
CREATE TABLE `cms_metaphor_design` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text COMMENT '设计意图内容',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='意象解析-设计意图表';

-- ============================================================
-- 9. 技术哲学表 (cms_philosophy)
-- ============================================================
DROP TABLE IF EXISTS `cms_philosophy`;
CREATE TABLE `cms_philosophy` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `title` varchar(100) NOT NULL COMMENT '哲学主题标题',
  `description` varchar(500) DEFAULT '' COMMENT '描述',
  `icon` varchar(50) DEFAULT '' COMMENT 'Font Awesome图标类名',
  `color_from` varchar(20) DEFAULT '' COMMENT '渐变色起始色',
  `color_to` varchar(20) DEFAULT '' COMMENT '渐变色结束色',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='技术哲学表';

-- ============================================================
-- 10. 里程碑表 (cms_milestone)
-- ============================================================
DROP TABLE IF EXISTS `cms_milestone`;
CREATE TABLE `cms_milestone` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `year` varchar(10) NOT NULL COMMENT '年份',
  `title` varchar(200) DEFAULT '' COMMENT '标题',
  `description` text COMMENT '事件描述',
  `icon` varchar(50) DEFAULT '' COMMENT 'Font Awesome图标类名',
  `color` varchar(20) DEFAULT '' COMMENT '节点颜色',
  `is_left` tinyint DEFAULT 1 COMMENT '时间线位置: 0-右侧 1-左侧',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='里程碑表';

-- ============================================================
-- 11. 跨生态表 (cms_ecosystem)
-- ============================================================
DROP TABLE IF EXISTS `cms_ecosystem`;
CREATE TABLE `cms_ecosystem` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '生态名称',
  `description` varchar(500) DEFAULT '' COMMENT '描述',
  `icon` varchar(50) DEFAULT '' COMMENT 'Font Awesome图标类名',
  `color_from` varchar(20) DEFAULT '' COMMENT '渐变色起始色',
  `color_to` varchar(20) DEFAULT '' COMMENT '渐变色结束色',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='跨生态表';

-- ============================================================
-- 12. 联系信息表 (cms_contact_info)
-- ============================================================
DROP TABLE IF EXISTS `cms_contact_info`;
CREATE TABLE `cms_contact_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type` varchar(20) DEFAULT 'other' COMMENT '类型: phone/email/address/wechat/other',
  `icon` varchar(50) DEFAULT '' COMMENT '图标(emoji或class)',
  `label` varchar(50) NOT NULL COMMENT '标签(如: 联系电话、电子邮箱)',
  `value` varchar(500) DEFAULT '' COMMENT '值(如: 400-888-8888)',
  `link` varchar(255) DEFAULT '' COMMENT '链接(如: tel:400-888-8888)',
  `sort_order` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='联系信息表';

-- ============================================================
-- 13. 留言消息表 (cms_contact_message)
-- ============================================================
DROP TABLE IF EXISTS `cms_contact_message`;
CREATE TABLE `cms_contact_message` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) NOT NULL COMMENT '留言人姓名',
  `email` varchar(100) DEFAULT '' COMMENT '电子邮箱',
  `phone` varchar(20) DEFAULT '' COMMENT '联系电话',
  `subject` varchar(200) DEFAULT '' COMMENT '主题',
  `message` text COMMENT '留言内容',
  `status` tinyint DEFAULT 0 COMMENT '状态: 0-未读 1-已读 2-已回复',
  `reply_content` text COMMENT '回复内容',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '留言时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='留言消息表';

-- ============================================================
-- 14. 站点配置表 (cms_site_config)
-- ============================================================
DROP TABLE IF EXISTS `cms_site_config`;
CREATE TABLE `cms_site_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `config_key` varchar(100) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `config_desc` varchar(200) DEFAULT '' COMMENT '配置说明',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点配置表';

-- ============================================================
-- 15. AI回答模板表 (cms_ai_reply_template)
-- ============================================================
DROP TABLE IF EXISTS `cms_ai_reply_template`;
CREATE TABLE `cms_ai_reply_template` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `keyword` varchar(50) NOT NULL COMMENT '匹配关键词',
  `reply` text NOT NULL COMMENT '回复内容',
  `sort_order` int DEFAULT 0 COMMENT '排序(越小越优先匹配)',
  `status` tinyint DEFAULT 1 COMMENT '状态: 0-隐藏 1-显示',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI回答模板表';
