module.exports = function({ types: t }) {
  return {
    visitor: {
      // path连接节点，访问节点其实是访问路径，对于path的更改会响应式的作用到node上
      VariableDeclaration(path) {
        const node = path.node;
        ["let", "const"].includes(node.kind) && (node.kind = "var");
      },
      ArrowFunctionExpression(path) {
        let { id, params, body, generator, async } = path.node;
        //箭头函数我们会简写{return a+b} 为 a+b
        if (!t.isBlockStatement(body)) {
          const node = t.returnStatement(body);
          body = t.blockStatement([node]);
        }
        path.replaceWith(
          t.functionExpression(id, params, body, generator, async)
        );
      }
    }
  };
};
