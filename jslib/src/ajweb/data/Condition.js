/**
 * @fileOverview サーバのデータベースのイベントを制限する条件オブジェクトクラスを定義
 *
 * @author Hiroki Kumamoto
 * @version 1.0.0
 */
dojo.provide("ajweb.data.Condition");

dojo.declare("ajweb.data.AbstractCondition", null,
/** @lends ajweb.data.AbstractCondition.prototype */
{
/**
 * Constructor
 * @class conditionのスーパークラス
 *
 * @constructs
 *
 * @param {Object} opt 初期化用のパラメータオブジェクト
 * @param {String} opt.op operator名
 * @param {Function} opt.left
 * @param {Function} opt.right
 * @param {Function} opt.operand
 * @param {String} opt.type
 */
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
/** @lends ajweb.data.Condition.prototype */
  {
    evaluate: function(targetItem){
      var left, right;
      left = this.encodeRefItem(this.left(targetItem));
      right = this.encodeRefItem(this.right(targetItem));
//      left = this.encodeRefItem(this.left);
//      right = this.encodeRefItem(this.right);
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
      var left = this.left();
      var right = this.right();
      if(this.type == "select"){
	if(left instanceof ajweb.data.Item)
	  json_obj = {op:  this.op, property: this.left.property , value: right};
	else
	  json_obj = {op:  this.op, property: this.right.property , value:left};
      }
      else {
	if(left instanceof ajweb.data.Item)
	  json_obj = {op:  this.op, property: left.property , value: right};
	else
	  json_obj = {op:  this.op, property: right.property , value: left};
      }

      if(json_obj.value instanceof Object)//参照型だったら
	json_obj.value = json_obj.value.id;

	return json_obj;
    },
    isContainDatabaseItem: function(){
      if(this.left() instanceof ajweb.data.Item || this.right() instanceof ajweb.data.Item)
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
/** @lends ajweb.data.Conditions.prototype */
{

  evaluate: function(targetItem){
    if(this.op == "and"){
      return this.left.evaluate(targetItem) && this.right.evaluate(targetItem);
    }
    else if(this.op == "or"){
      return this.left.evaluate(targetItem) || this.right.evaluate(targetItem);
    }
    else if(this.op == "not"){
      return !this.operand.evaluate(targetItem);
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
