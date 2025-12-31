import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Typography, Space, Divider, App } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { ExportFormatConfig, DEFAULT_EXPORT_FORMAT_CONFIG } from '../types';

const { Paragraph } = Typography;

interface ExportFormatConfigModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * 导出格式配置弹窗组件
 */
const ExportFormatConfigModal: React.FC<ExportFormatConfigModalProps> = ({ visible, onClose }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
   * 处理表单提交
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      
      const exportFormatConfig: ExportFormatConfig = {
        doc: values.docFormat,
        docx: values.docxFormat,
        sheet: values.sheetFormat,
        bitable: values.bitableFormat,
        slides: values.slidesFormat,
        mindnote: values.mindnoteFormat
      };

      saveExportFormatConfig(exportFormatConfig);
      message.success('导出格式配置已保存！');
      onClose();
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 弹窗打开时加载配置
  useEffect(() => {
    if (visible) {
      const config = loadExportFormatConfig();
      form.setFieldsValue({
        docFormat: config.doc,
        docxFormat: config.docx,
        sheetFormat: config.sheet,
        bitableFormat: config.bitable,
        slidesFormat: config.slides,
        mindnoteFormat: config.mindnote
      });
    }
  }, [visible, form]);

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          <span>导出格式配置</span>
        </Space>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="保存配置"
      cancelText="取消"
      confirmLoading={loading}
      width={500}
      destroyOnClose
    >
      <Paragraph type="secondary" style={{ fontSize: '13px', marginBottom: '16px' }}>
        为不同类型的文档选择导出格式，配置将应用于所有后续的下载任务
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="飞书文档 (Doc)"
          name="docFormat"
          initialValue="docx"
          rules={[{ required: true, message: '请选择导出格式' }]}
        >
          <Select>
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
          <Select>
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
          <Select>
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
          <Select>
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
          <Select>
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
          <Select disabled>
            <Select.Option value="pdf">PDF格式 (.pdf)</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Paragraph type="secondary" style={{ fontSize: '12px' }}>
          配置将保存在本地，并应用于所有新创建的下载任务
        </Paragraph>
      </div>
    </Modal>
  );
};

export default ExportFormatConfigModal;
