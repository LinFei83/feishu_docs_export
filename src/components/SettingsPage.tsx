import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Space, App, Divider, Collapse, Select } from 'antd';
import { SettingOutlined, SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { FeishuConfig } from '../utils/feishuApi';
import { ExportFormatConfig, DEFAULT_EXPORT_FORMAT_CONFIG } from '../types';

const { Title, Paragraph } = Typography;

// 自定义输入框样式
const inputStyle = {
  boxShadow: 'none !important',
  border: '1px solid #d9d9d9',
  borderRadius: '6px',
  transition: 'border-color 0.3s ease'
};

/**
 * 设置页面组件属性
 */
interface SettingsPageProps {
  onBack?: () => void;
  onConfigSaved?: (config: FeishuConfig) => void;
}

/**
 * 飞书设置页面组件
 */
const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onConfigSaved }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * 从 localStorage 加载配置
   */
  const loadConfig = (): FeishuConfig => {
    try {
      const configStr = localStorage.getItem('feishu_config');
      if (configStr) {
        return JSON.parse(configStr);
      }
    } catch (error) {
      console.error('加载飞书配置失败:', error);
    }
    
    // 返回默认配置
    return {
      appId: '',
      appSecret: '',
      endpoint: 'https://open.feishu.cn/open-apis'
    };
  };

  /**
   * 从 localStorage 加载导出格式配置
   */
  const loadExportFormatConfig = (): ExportFormatConfig => {
    try {
      const configStr = localStorage.getItem('export_format_config');
      if (configStr) {
        return JSON.parse(configStr);
      }
    } catch (error) {
      console.error('加载导出格式配置失败:', error);
    }
    return DEFAULT_EXPORT_FORMAT_CONFIG;
  };

  /**
   * 保存导出格式配置到 localStorage
   */
  const saveExportFormatConfig = (config: ExportFormatConfig): void => {
    try {
      localStorage.setItem('export_format_config', JSON.stringify(config));
    } catch (error) {
      console.error('保存导出格式配置失败:', error);
      throw error;
    }
  };

  /**
   * 保存配置到 localStorage
   */
  const saveConfig = (config: FeishuConfig): void => {
    try {
      localStorage.setItem('feishu_config', JSON.stringify(config));
    } catch (error) {
      console.error('保存飞书配置失败:', error);
      throw error;
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 验证必填字段
      if (!values.appId || !values.appSecret || !values.endpoint) {
        message.error('请填写完整的配置信息');
        return;
      }

      // 分离飞书配置和导出格式配置
      const feishuConfig: FeishuConfig = {
        appId: values.appId,
        appSecret: values.appSecret,
        endpoint: values.endpoint
      };

      const exportFormatConfig: ExportFormatConfig = {
        doc: values.docFormat,
        docx: values.docxFormat,
        sheet: values.sheetFormat,
        bitable: values.bitableFormat,
        slides: values.slidesFormat,
        mindnote: values.mindnoteFormat
      };

      // 保存配置
      saveConfig(feishuConfig);
      saveExportFormatConfig(exportFormatConfig);
      message.success('配置保存成功！');
      
      // 通知父组件配置已保存
      if (onConfigSaved) {
        onConfigSaved(feishuConfig);
      }
      
      // 如果有返回回调，延迟执行
      if (onBack) {
        setTimeout(() => {
          onBack();
        }, 1000);
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 重置为默认配置
   */
  const handleReset = () => {
    const defaultConfig = {
      appId: '',
      appSecret: '',
      endpoint: 'https://open.feishu.cn/open-apis',
      docFormat: DEFAULT_EXPORT_FORMAT_CONFIG.doc,
      docxFormat: DEFAULT_EXPORT_FORMAT_CONFIG.docx,
      sheetFormat: DEFAULT_EXPORT_FORMAT_CONFIG.sheet,
      bitableFormat: DEFAULT_EXPORT_FORMAT_CONFIG.bitable,
      slidesFormat: DEFAULT_EXPORT_FORMAT_CONFIG.slides,
      mindnoteFormat: DEFAULT_EXPORT_FORMAT_CONFIG.mindnote
    };
    form.setFieldsValue(defaultConfig);
  };

  // 组件挂载时加载配置
  useEffect(() => {
    const config = loadConfig();
    const exportFormatConfig = loadExportFormatConfig();
    form.setFieldsValue({
      ...config,
      docFormat: exportFormatConfig.doc,
      docxFormat: exportFormatConfig.docx,
      sheetFormat: exportFormatConfig.sheet,
      bitableFormat: exportFormatConfig.bitable,
      slidesFormat: exportFormatConfig.slides,
      mindnoteFormat: exportFormatConfig.mindnote
    });
  }, [form]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: 500, maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <SettingOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={3}>飞书应用配置</Title>
          <Paragraph type="secondary">
            请配置您的飞书应用信息，这些信息将用于连接飞书API
          </Paragraph>
          
          <Collapse 
            size="small"
            style={{ marginTop: '16px', textAlign: 'left' }}
            items={[
              {
                key: 'setup-guide',
                label: (
                  <span style={{ color: '#1890ff', fontSize: '13px' }}>
                    <InfoCircleOutlined style={{ marginRight: '6px' }} />
                    配置指南（点击查看详细说明）
                  </span>
                ),
                children: (
                  <div>
                    <div style={{ 
                      background: '#f6ffed', 
                      border: '1px solid #b7eb8f', 
                      borderRadius: '6px', 
                      padding: '12px', 
                      marginBottom: '12px'
                    }}>
                      <Paragraph style={{ margin: 0, fontSize: '13px', color: '#52c41a' }}>
                        <strong>重定向URL配置（必须配置）：</strong>请确保在飞书应用设置中添加以下重定向URL：
                      </Paragraph>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: '#389e0d' }}>
                        <li><code>http://localhost:3000/callback</code></li>
                        <li><code>http://localhost:3001/callback</code></li>
                      </ul>
                      <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d46b08' }}>
                        <strong>注意：</strong>必须添加完整的URL（包含 /callback 路径），否则会出现 4401 错误
                      </Paragraph>
                      <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#389e0d' }}>
                        路径：飞书开放平台 → 应用管理 → 您的应用 → 安全设置 → 重定向URL
                      </Paragraph>
                    </div>
                    
                    <div style={{ 
                       background: '#fff7e6', 
                       border: '1px solid #ffd591', 
                       borderRadius: '6px', 
                       padding: '12px'
                     }}>
                       <Paragraph style={{ margin: 0, fontSize: '13px', color: '#d48806' }}>
                        <strong>权限配置（必须配置）：</strong>请确保为应用开通以下权限范围（Scope）：
                      </Paragraph>
                      <div style={{ margin: '8px 0', padding: '8px', background: '#fef9e7', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace', color: '#8b5a00', wordBreak: 'break-all' }}>
                        contact:user.employee_id:readonly docs:doc docs:document.media:download docs:document:export docx:document drive:drive drive:file drive:file:download wiki:wiki offline_access
                      </div>
                      <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d46b08' }}>
                        <strong>具体权限说明：</strong>
                      </Paragraph>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '11px', color: '#d46b08' }}>
                        <li><code>contact:user.employee_id:readonly</code> - <strong>【必需】</strong>查看云盘文件列表</li>
                        <li><code>wiki:wiki</code> - <strong>【必需】</strong>访问知识库空间</li>
                        <li><code>docs:doc</code> - 查看、评论、编辑和管理云文档</li>
                        <li><code>docs:document.media:download</code> - 下载云文档中的媒体文件</li>
                        <li><code>docs:document:export</code> - 导出云文档为指定格式</li>
                        <li><code>docx:document</code> - 访问新版文档</li>
                        <li><code>drive:drive</code> - 获取云空间信息</li>
                        <li><code>drive:file</code> - 访问云空间文件</li>
                        <li><code>drive:file:download</code> - 下载云空间文件</li>
                        <li><code>offline_access</code> - 离线访问授权数据</li>
                      </ul>
                       <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d46b08' }}>
                         路径：飞书开放平台 → 应用管理 → 您的应用 → 权限管理 → 权限配置
                       </Paragraph>
                     </div>
                  </div>
                )
              }
            ]}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="应用ID (App ID)"
            name="appId"
            rules={[
              { required: true, message: '请输入应用ID' },
              { min: 10, message: '应用ID长度不能少于10位' }
            ]}
          >
            <Input 
              placeholder="请输入飞书应用的App ID"
              size="large"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            label="应用密钥 (App Secret)"
            name="appSecret"
            rules={[
              { required: true, message: '请输入应用密钥' },
              { min: 10, message: '应用密钥长度不能少于10位' }
            ]}
          >
            <Input.Password 
              placeholder="请输入飞书应用的App Secret"
              size="large"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>

          <Form.Item
            label="API端点 (Endpoint)"
            name="endpoint"
            rules={[
              { required: true, message: '请输入API端点' },
              { type: 'url', message: '请输入有效的URL地址' }
            ]}
          >
            <Input 
              placeholder="https://open.feishu.cn/open-apis"
              size="large"
              style={inputStyle}
              className="custom-input"
            />
          </Form.Item>

          <Divider>
            <Space>
              <FileTextOutlined />
              <span>导出格式配置</span>
            </Space>
          </Divider>

          <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '16px' }}>
            为不同类型的文档选择导出格式
          </Paragraph>

          <Form.Item
            label="飞书文档 (Doc)"
            name="docFormat"
            initialValue="docx"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select size="large" style={inputStyle}>
              <Select.Option value="docx">Word格式 (.docx)</Select.Option>
              <Select.Option value="pdf">PDF格式 (.pdf)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="新版文档 (Docx)"
            name="docxFormat"
            initialValue="docx"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select size="large" style={inputStyle}>
              <Select.Option value="docx">Word格式 (.docx)</Select.Option>
              <Select.Option value="pdf">PDF格式 (.pdf)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="电子表格 (Sheet)"
            name="sheetFormat"
            initialValue="xlsx"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select size="large" style={inputStyle}>
              <Select.Option value="xlsx">Excel格式 (.xlsx)</Select.Option>
              <Select.Option value="csv">CSV格式 (.csv)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="多维表格 (Bitable)"
            name="bitableFormat"
            initialValue="xlsx"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select size="large" style={inputStyle}>
              <Select.Option value="xlsx">Excel格式 (.xlsx)</Select.Option>
              <Select.Option value="csv">CSV格式 (.csv)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="演示文稿 (Slides)"
            name="slidesFormat"
            initialValue="pptx"
            rules={[{ required: true, message: '请选择导出格式' }]}
          >
            <Select size="large" style={inputStyle}>
              <Select.Option value="pptx">PowerPoint格式 (.pptx)</Select.Option>
              <Select.Option value="pdf">PDF格式 (.pdf)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="思维笔记 (Mindnote)"
            name="mindnoteFormat"
            initialValue="pdf"
            tooltip="思维笔记仅支持PDF格式"
          >
            <Select size="large" style={inputStyle} disabled>
              <Select.Option value="pdf">PDF格式 (.pdf)</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                {onBack && (
                  <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                  >
                    返回
                  </Button>
                )}
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                保存配置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Paragraph type="secondary" style={{ fontSize: '12px' }}>
            配置信息将保存在本地，不会上传到服务器
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;