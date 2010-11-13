/**
 * @fileOverview サーバのデータベースのイベントを制限する条件オブジェクトクラスを定義
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.data.Condition");

dojo.declare("ajweb.data.AbstractCondition", null,
{
  constructor : function(opt){
      this.op = opt.op;
      this.left = opt.left;
      this.right = opt.right;
      this.operand = opt.operand;
      this.type = opt.type;
    },
    setLeft :function(left){
      this.left = left;
    },
    setRight :function(right){
      this.right = right;
    },
    setOperand: function(left, right){
      if(left)
	this.left = left;
      if(right)
	this.right = right;
    },
    setOperator: function(op){
      this.op = op;
    }
  }
);



dojo.declare("ajweb.data.Condition", ajweb.data.AbstractCondition,
  {
    evaluate: function(targetItem){
      var left, right;
      left = this.encodeRefItem(this.left);
      right = this.encodeRefItem(this.right);
/*      if(this.left instanceof ajweb.data.Item)//ajweb.data.Itemはサーバのポーリング条件にのみ使う
	left = targetItem[this.left.property];
      else
	left = eval(this.left);//ポーリングの場合は，leftはコードの文字列になっているのでevalして
      if(this.right instanceof ajweb.data.Item)
	right = targetItem[this.left.property];
      else
	right = eval(this.right);*/

      if(this.op == "eq"){
	return left == right;
      }
      else if(this.op == "neq"){
	return left != right;
      }
      else if(this.op == "gt"){
	return left > right;
      }
      else if(this.op == "gte"){
	return left >= right;
      }
      else if(this.op == "lt"){
	return left < right;
      }
      else if(this.op == "lte"){
	return left <= right;
      }
      throw new Error("unknown condition operator: " + this.op);
    },
    toJSON: function(){
      var json_obj;
      if(this.type == "select"){
	if(this.left instanceof ajweb.data.Item)
	  json_obj = {op:  this.op, property: this.left.property , value: this.right};
	else
	  json_obj = {op:  this.op, property: this.right.property , value:this.left};
      }
      else {
	if(this.left instanceof ajweb.data.Item)
	  json_obj = {op:  this.op, property: this.left.property , value: eval(this.right)};
	else
	  json_obj = {op:  this.op, property: this.right.property , value: eval(this.left)};
      }

      if(json_obj.value instanceof Object)//参照型だったら
	json_obj.value = json_obj.value.id;

	return json_obj;
    },
    isContainDatabaseItem: function(){
      if(this.left instanceof ajweb.data.Item || this.right instanceof ajweb.data.Item)
	return true;
      else
	return false;
    },
    encodeRefItem: function(operand){
      if(operand instanceof Object) //参照型ならidに変換
	return operand.id;
      else
	return operand;
    }
  }
);

dojo.declare("ajweb.data.Conditions", ajweb.data.AbstractCondition,
{

  evaluate: function(){
    if(this.op == "and"){
      return this.left.evaluate() && this.right.evaluate();
    }
    else if(this.op == "or"){
      return this.left.evaluate() || this.right.evaluate();
    }
    else if(this.op == "not"){
      return !this.operand.evaluate();
    }
    else
      throw new Error("unknown condition operator:" + this.op);
  },
  toJSON: function(){
    var json_obj;
    if(this.op == "not"){
      json_obj = {op: this.op, operand: this.operand};
    }
    else if(this.op == "and"){
      if(this.left.isContainDatabaseItem() && this.right.isContainDatabaseItem())
	json_obj = {op:  this.op , left: this.left.toJSON() , right:  this.right.toJSON()};
      else if(this.left.isContainDatabaseItem())
	json_obj = this.left.toJSON();
      else
	json_obj = this.right.toJSON();
    }
    else if(this.op == "or"){
      if(this.left.isContainDatabaseItem() && this.right.isContainDatabaseItem())
	json_obj = {op: this.op, left: this.left.toJSON() , right: this.right.toJSON()};
      else
	throw new Error("please check by isContainDatabaseItem()!");
    }
    return json_obj;
  },
  isContainDatabaseItem: function(){
    if(this.op == "not"){
      return this.operand.isContainDatabaseItem();
    }
    else if(this.op == "and") {
      return this.left.isContainDatabaseItem() || this.right.isContainDatabaseItem();
    }
    else if(this.op == "or") {
      return this.left.isContainDatabaseItem() && this.right.isContainDatabaseItem();
    }
    else
      throw new Error("unknown condition operator:" + this.op);
  }
});
