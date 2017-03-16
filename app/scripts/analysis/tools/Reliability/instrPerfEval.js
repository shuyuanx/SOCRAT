// Generated by CoffeeScript 1.12.2
(function() {
  'use strict';
  var instrPerfEval;

  instrPerfEval = angular.module('app_analysis_instrPerfEval', []).factory('app_analysis_instrPerfEval_constructor', [
    'app_analysis_instrPerfEval_manager', function(manager) {
      return function(sb) {
        var _msgList;
        if (!(sb == null)) {
          manager.setSb(sb);
        }
        _msgList = manager.getMsgList();
        return {
          init: function(opt) {
            return console.log('instrPerfEval init invoked');
          },
          destroy: function() {},
          msgList: _msgList
        };
      };
    }
  ]).factory('app_analysis_instrPerfEval_manager', [
    '$rootScope', function($rootScope) {
      var _broadcast, _getMsgList, _getSb, _getSupportedDataTypes, _msgList, _sb, _setSb;
      _sb = null;
      _msgList = {
        outgoing: ['get table'],
        incoming: ['take table'],
        scope: ['instrPerfEval']
      };
      _setSb = function(sb) {
        return _sb = sb;
      };
      _getSb = function() {
        return _sb;
      };
      _getMsgList = function() {
        return _msgList;
      };
      _getSupportedDataTypes = function() {
        if (_sb) {
          return _sb.getSupportedDataTypes();
        } else {
          return false;
        }
      };
      _broadcast = function(msg, data) {
        return $rootScope.$broadcast(msg, data);
      };
      return {
        getSb: _getSb,
        setSb: _setSb,
        getMsgList: _getMsgList,
        broadcast: _broadcast,
        getSupportedDataTypes: _getSupportedDataTypes
      };
    }
  ]).controller('instrPerfEvalMainCtrl', [
    'app_analysis_instrPerfEval_manager', 'app_analysis_instrPerfEval_alphaCalculator', '$scope', function(ctrlMngr, alphaCalculator, $scope) {
      var calculateMetrics, prettifyArrayOutput;
      console.log('instrPerfEvalViewMainCtrl executed');
      $scope.DATA_TYPES = ctrlMngr.getSupportedDataTypes();
      $scope.dataType = '';
      prettifyArrayOutput = function(arr) {
        if (arr != null) {
          arr = arr.map(function(x) {
            return x.toFixed(3);
          });
          return '[' + arr.toString().split(',').join('; ') + ']';
        }
      };
      calculateMetrics = function() {
        var cAlpha, data;
        data = alphaCalculator.getAlpha();
        cAlpha = Number(data.cronAlpha);
        if (!isNaN(cAlpha)) {
          $scope.cronAlpha = cAlpha.toFixed(3);
          $scope.cronAlphaIdInterval = prettifyArrayOutput(data.idInterval);
          $scope.cronAlphaKfInterval = prettifyArrayOutput(data.kfInterval);
          $scope.cronAlphaLogitInterval = prettifyArrayOutput(data.logitInterval);
          $scope.cronAlphaBootstrapInterval = prettifyArrayOutput(data.bootstrapInterval);
          $scope.cronAlphaAdfInterval = prettifyArrayOutput(data.adfInterval);
        }
        $scope.icc = Number(data.icc).toFixed(3);
        $scope.kr20 = data.kr20 === 'Not a binary data' ? data.kr20 : Number(data.kr20).toFixed(3);
        return $scope.splitHalfCoef = Number(data.adjRCorrCoef).toFixed(3);
      };
      $scope.$on('instrPerfEval:updateDataType', function(event, dataType) {
        return $scope.dataType = dataType;
      });
      return calculateMetrics();
    }
  ]).controller('instrPerfEvalSidebarCtrl', [
    'app_analysis_instrPerfEval_manager', 'app_analysis_instrPerfEval_alphaCalculator', '$scope', '$stateParams', '$q', '$timeout', function(msgMngr, alphaCalculator, $scope, $stateParams, $q, $timeout) {
      var DATA_TYPES, deferred, parseData, sb, token;
      console.log('instrPerfEvalViewSidebarCtrl executed');
      DATA_TYPES = msgMngr.getSupportedDataTypes();
      sb = msgMngr.getSb();
      deferred = $q.defer();
      $scope.nCols = '5';
      $scope.nRows = '5';
      $scope.confLevel = 0.95;
      $scope.perfeval = false;
      parseData = function(obj) {
        var ref, ref1;
        $scope.nRows = (ref = obj.data) != null ? ref.length : void 0;
        $scope.nCols = (ref1 = obj.data[0]) != null ? ref1.length : void 0;
        $scope.perfeval = true;
        return alphaCalculator.calculate(obj, $scope.confLevel);
      };
      token = sb.subscribe({
        msg: 'take table',
        msgScope: ['instrPerfEval'],
        listener: function(msg, data) {
          if ((data.dataType != null) && data.dataType === DATA_TYPES.FLAT) {
            $timeout(function() {
              return msgMngr.broadcast('instrPerfEval:updateDataType', data.dataType);
            });
            return parseData(data);
          }
        }
      });
      return sb.publish({
        msg: 'get table',
        msgScope: ['instrPerfEval'],
        callback: function() {
          return sb.unsubscribe(token);
        },
        data: {
          tableName: $stateParams.projectId + ':' + $stateParams.forkId,
          promise: deferred
        }
      });
    }
  ]).factory('app_analysis_instrPerfEval_alphaCalculator', [
    function() {
      var _calculate, _data, _getAlpha, _getCAlpha, _getCAlphaConfIntervals, _getIcc, _getKr20, _getSpliHalfReliability;
      _data = [];
      _getAlpha = function() {
        return _data;
      };
      _getCAlpha = function(matrix) {
        var cAlpha, k, rowTotalsVar, sumColsVar;
        matrix = jStat(matrix);
        k = jStat.cols(matrix);
        sumColsVar = jStat.sum(matrix.variance());
        rowTotalsVar = jStat.variance(matrix.transpose().sum());
        return cAlpha = (k / (k - 1)) * (1 - sumColsVar / rowTotalsVar);
      };
      _getCAlphaConfIntervals = function(matrix, cAlpha, gamma) {
        var B, _cAlphaConfIntervals, a, accelAlphaDenom, accelAlphaNum, accelerationAlpha, adfIntervalLeft, adfIntervalRight, alphaBootstrapped, alphaCapIthDeleted, alphaCapJackknife, bootstrapPercentiles, col, colMeans, colMeansSquared, cov, covDiagSum, covOffDiagSum, covSum, dwrtcov, dwrtvar, gamma1, gamma1Denom, gamma1Num, gamma2, gamma2Denom, gamma2Num, i, i1, idIntervalAbsDev, idIntervalLeft, idIntervalRight, idx, isub, j, j1, jac, k, k1, kfIntervalLeft, kfIntervalRight, l, l1, len, len1, logitIntervalLeft, logitIntervalRight, m, matrixSquared, matrixWithoutIdxRow, n, newRowIdx, nnase, o, omega, p, q, r, ref, ref1, ref10, ref11, ref12, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, row, rowsAfterIdx, rowsBeforeIdx, sample, sampleMatrix, smallerAlphas, thetaAbsDev, thetaCap, thetaIntervalLeft, thetaIntervalRight, trac, u, v, val, varCapAlphaCap, varCapThetaCap, w, wcv, wcvSum, y, z, zCapZero;
        matrix = jStat(matrix);
        k = jStat.cols(matrix);
        r = jStat.rows(matrix);
        matrixSquared = jStat.create(k, function(i, j) {
          return 0;
        });
        ref = matrix.transpose();
        for (i = m = 0, len = ref.length; m < len; i = ++m) {
          row = ref[i];
          ref1 = matrix.transpose();
          for (j = n = 0, len1 = ref1.length; n < len1; j = ++n) {
            col = ref1[j];
            matrixSquared[i][j] = ((function() {
              var results;
              results = [];
              for (l in row) {
                a = row[l];
                results.push(a * col[l]);
              }
              return results;
            })()).reduce(function(t, s) {
              return t + s;
            });
          }
        }
        colMeans = matrix.mean();
        colMeansSquared = jStat.create(k, function(i, j) {
          return 0;
        });
        for (i = o = 0, ref2 = k - 1; 0 <= ref2 ? o <= ref2 : o >= ref2; i = 0 <= ref2 ? ++o : --o) {
          for (j = p = 0, ref3 = k - 1; 0 <= ref3 ? p <= ref3 : p >= ref3; j = 0 <= ref3 ? ++p : --p) {
            colMeansSquared[i][j] = colMeans[i] * colMeans[j] * r;
          }
        }
        cov = jStat.create(k, function(i, j) {
          return 0;
        });
        covSum = 0;
        covDiagSum = 0;
        for (i = q = 0, ref4 = k - 1; 0 <= ref4 ? q <= ref4 : q >= ref4; i = 0 <= ref4 ? ++q : --q) {
          for (j = u = 0, ref5 = k - 1; 0 <= ref5 ? u <= ref5 : u >= ref5; j = 0 <= ref5 ? ++u : --u) {
            cov[i][j] = (matrixSquared[i][j] - colMeansSquared[i][j]) * (1 / (r - 1));
            covSum = covSum + cov[i][j];
            if (i === j) {
              covDiagSum = covDiagSum + cov[i][j];
            }
          }
        }
        covOffDiagSum = (covSum - covDiagSum) / 2;
        dwrtvar = -2 * (k / (k - 1)) * covOffDiagSum / (covSum * covSum);
        dwrtcov = (k / (k - 1)) * covOffDiagSum / (covSum * covSum);
        jac = jStat.create(k, function(i, j) {
          return dwrtcov;
        });
        for (j = w = 0, ref6 = k - 1; 0 <= ref6 ? w <= ref6 : w >= ref6; j = 0 <= ref6 ? ++w : --w) {
          jac[j][j] = dwrtvar;
        }
        trac = 0;
        for (isub = y = 0, ref7 = r - 1; 0 <= ref7 ? y <= ref7 : y >= ref7; isub = 0 <= ref7 ? ++y : --y) {
          v = jStat(matrix).row(isub)[0].map(function(x, i) {
            return x - colMeans[i];
          });
          wcv = jStat.create(k, function(i, j) {
            return 0;
          });
          wcvSum = 0;
          for (i = z = 0, ref8 = k - 1; 0 <= ref8 ? z <= ref8 : z >= ref8; i = 0 <= ref8 ? ++z : --z) {
            for (j = i1 = 0, ref9 = k - 1; 0 <= ref9 ? i1 <= ref9 : i1 >= ref9; j = 0 <= ref9 ? ++i1 : --i1) {
              wcv[i][j] = jac[i][j] * (v[i] * v[j] - cov[i][j]);
              wcvSum = wcvSum + wcv[i][j];
            }
          }
          trac = trac + wcvSum * wcvSum;
        }
        nnase = Math.sqrt((1 / r) * (1 / (r - 1)) * trac);
        adfIntervalLeft = cAlpha - jStat.normal.inv(1 - gamma / 2, 0, 1) * nnase;
        adfIntervalRight = cAlpha + jStat.normal.inv(1 - gamma / 2, 0, 1) * nnase;
        omega = 2 * (k - 1) * (1 - cAlpha) / k;
        varCapAlphaCap = (k * k * omega) / (r * (k - 1) * (k - 1));
        idIntervalAbsDev = jStat.normal.inv(1 - gamma / 2, 0, 1) * Math.sqrt(varCapAlphaCap);
        idIntervalLeft = cAlpha - idIntervalAbsDev;
        idIntervalRight = cAlpha + idIntervalAbsDev;
        kfIntervalLeft = 1 - (1 - cAlpha) * Math.exp(jStat.normal.inv(1 - gamma / 2, 0, 1) * Math.sqrt(2 * k / (r * (k - 1))));
        kfIntervalRight = 1 - (1 - cAlpha) * Math.exp(-1 * jStat.normal.inv(1 - gamma / 2, 0, 1) * Math.sqrt(2 * k / (r * (k - 1))));
        alphaCapIthDeleted = [];
        for (idx = j1 = 0, ref10 = r - 1; 0 <= ref10 ? j1 <= ref10 : j1 >= ref10; idx = 0 <= ref10 ? ++j1 : --j1) {
          rowsBeforeIdx = matrix.slice(0, idx);
          rowsAfterIdx = matrix.slice(idx + 1);
          matrixWithoutIdxRow = rowsBeforeIdx.concat(rowsAfterIdx);
          alphaCapIthDeleted.push(_getCAlpha(matrixWithoutIdxRow));
        }
        alphaCapJackknife = (alphaCapIthDeleted.reduce(function(t, s) {
          return t + s;
        })) / r;
        accelAlphaNum = (alphaCapIthDeleted.map(function(x) {
          return x - alphaCapJackknife;
        })).map(function(x) {
          return Math.pow(x, 3);
        });
        accelAlphaNum = accelAlphaNum.reduce(function(t, s) {
          return t + s;
        });
        accelAlphaDenom = (alphaCapIthDeleted.map(function(x) {
          return x - alphaCapJackknife;
        })).map(function(x) {
          return Math.pow(x, 2);
        });
        accelAlphaDenom = 6 * Math.pow(accelAlphaDenom.reduce(function(t, s) {
          return t + s;
        }), 3 / 2);
        accelerationAlpha = accelAlphaNum / accelAlphaDenom;
        B = 1000;
        alphaBootstrapped = [];
        for (sample = k1 = 0, ref11 = B - 1; 0 <= ref11 ? k1 <= ref11 : k1 >= ref11; sample = 0 <= ref11 ? ++k1 : --k1) {
          sampleMatrix = [];
          for (idx = l1 = 0, ref12 = r - 1; 0 <= ref12 ? l1 <= ref12 : l1 >= ref12; idx = 0 <= ref12 ? ++l1 : --l1) {
            newRowIdx = Math.floor(Math.random() * r);
            sampleMatrix.push(matrix[newRowIdx]);
          }
          alphaBootstrapped.push(_getCAlpha(sampleMatrix));
        }
        smallerAlphas = (function() {
          var len2, m1, results;
          results = [];
          for (m1 = 0, len2 = alphaBootstrapped.length; m1 < len2; m1++) {
            val = alphaBootstrapped[m1];
            if (val < cAlpha) {
              results.push(val);
            }
          }
          return results;
        })();
        zCapZero = jStat.normal.inv(smallerAlphas.length / B, 0, 1);
        gamma1Num = zCapZero + jStat.normal.inv(gamma / 2, 0, 1);
        gamma1Denom = 1 - cAlpha * (zCapZero + jStat.normal.inv(gamma / 2, 0, 1));
        gamma1 = jStat.normal.cdf(zCapZero + gamma1Num / gamma1Denom, 0, 1);
        gamma2Num = zCapZero + jStat.normal.inv(1 - gamma / 2, 0, 1);
        gamma2Denom = 1 - cAlpha * (zCapZero + jStat.normal.inv(1 - gamma / 2, 0, 1));
        gamma2 = jStat.normal.cdf(zCapZero + gamma2Num / gamma2Denom, 0, 1);
        bootstrapPercentiles = [jStat.percentile(alphaBootstrapped, gamma1), jStat.percentile(alphaBootstrapped, gamma2)];
        bootstrapPercentiles = bootstrapPercentiles.sort();
        thetaCap = Math.log(cAlpha / (1 - cAlpha));
        varCapThetaCap = varCapAlphaCap * Math.pow(1 / cAlpha + 1 / (1 - cAlpha), 2);
        thetaAbsDev = jStat.normal.inv(1 - gamma / 2, 0, 1) * Math.sqrt(varCapThetaCap);
        thetaIntervalLeft = thetaCap - thetaAbsDev;
        thetaIntervalRight = thetaCap + thetaAbsDev;
        logitIntervalLeft = Math.exp(thetaIntervalLeft) / (1 + Math.exp(thetaIntervalLeft));
        logitIntervalRight = Math.exp(thetaIntervalRight) / (1 + Math.exp(thetaIntervalRight));
        return _cAlphaConfIntervals = {
          idInterval: [Math.max(0, idIntervalLeft), Math.min(1, idIntervalRight)],
          kfInterval: [Math.max(0, kfIntervalLeft), Math.min(1, kfIntervalRight)],
          logitInterval: [Math.max(0, logitIntervalLeft), Math.min(1, logitIntervalRight)],
          bootstrapInterval: [Math.max(0, bootstrapPercentiles[0]), Math.min(1, bootstrapPercentiles[1])],
          adfInterval: [Math.max(0, adfIntervalLeft), Math.min(1, adfIntervalRight)]
        };
      };
      _getIcc = function(matrix) {
        var colMeans, i, icc, ij, j, k, len, len1, m, matrixMean, msCols, msErr, msRows, n, r, row, rowMeans, ssCols, ssErr, ssRows;
        matrix = jStat(matrix);
        k = jStat.cols(matrix);
        r = jStat.rows(matrix);
        matrixMean = jStat.sum(matrix.sum()) / (r * k);
        rowMeans = matrix.transpose().mean();
        colMeans = matrix.mean();
        ssRows = k * jStat.sum(jStat.pow(jStat.subtract(rowMeans, matrixMean), 2));
        ssCols = r * jStat.sum(jStat.pow(jStat.subtract(colMeans, matrixMean), 2));
        ssErr = 0;
        for (i = m = 0, len = matrix.length; m < len; i = ++m) {
          row = matrix[i];
          for (j = n = 0, len1 = row.length; n < len1; j = ++n) {
            ij = row[j];
            ssErr = ssErr + Math.pow(ij - rowMeans[i] - colMeans[j] + matrixMean, 2);
          }
        }
        msRows = ssRows / (r - 1);
        msCols = ssCols / (k - 1);
        msErr = ssErr / ((r - 1) * (k - 1));
        return icc = ((msRows - msErr) / k) / ((msRows - msErr) / k + (msCols - msErr) / r + msErr);
      };
      _getSpliHalfReliability = function(matrix) {
        var adjRCorrCoef, col, colIdx, evenSum, k, len, m, meanEven, meanOdd, n, nGroups, oddSum, r, rCorrCoef, ref, ref1, x;
        matrix = jStat(matrix);
        k = jStat.cols(matrix);
        r = jStat.rows(matrix);
        nGroups = 2;
        oddSum = jStat.zeros(1, r)[0];
        evenSum = jStat.zeros(1, r)[0];
        ref = matrix.transpose();
        for (m = 0, len = ref.length; m < len; m += 2) {
          col = ref[m];
          evenSum = (function() {
            var results;
            results = [];
            for (x in evenSum) {
              results.push(evenSum[x] + col[x]);
            }
            return results;
          })();
        }
        for (colIdx = n = 1, ref1 = k - 1; n <= ref1; colIdx = n += 2) {
          col = jStat.transpose(jStat.col(matrix, colIdx));
          oddSum = (function() {
            var results;
            results = [];
            for (x in oddSum) {
              results.push(oddSum[x] + col[x]);
            }
            return results;
          })();
        }
        meanOdd = jStat.mean(oddSum);
        meanEven = jStat.mean(evenSum);
        rCorrCoef = jStat.corrcoeff(oddSum, evenSum);
        return adjRCorrCoef = rCorrCoef * nGroups / (1 + (nGroups - 1) * rCorrCoef);
      };
      _getKr20 = function(matrix) {
        var kr20, zeroMatrix;
        matrix = jStat(matrix);
        zeroMatrix = matrix.subtract(1);
        if (jStat.sum(jStat(zeroMatrix).sum()) !== 0) {
          return kr20 = 'Not a binary data';
        }
      };
      _calculate = function(obj, confLevel) {
        var _cAlpha, _cAlphaConfIntervals, _gamma, _matrix;
        _matrix = jStat(obj.data);
        _matrix = jStat(jStat.map(_matrix, Number));
        _gamma = (1 - confLevel) * 2;
        _cAlpha = _getCAlpha(_matrix);
        _cAlphaConfIntervals = _getCAlphaConfIntervals(_matrix, _cAlpha, _gamma);
        return _data = {
          cronAlpha: _cAlpha,
          icc: _getIcc(_matrix),
          kr20: _getKr20(_matrix),
          adjRCorrCoef: _getSpliHalfReliability(_matrix),
          idInterval: _cAlphaConfIntervals.idInterval,
          kfInterval: _cAlphaConfIntervals.kfInterval,
          logitInterval: _cAlphaConfIntervals.logitInterval,
          bootstrapInterval: _cAlphaConfIntervals.bootstrapInterval,
          adfInterval: _cAlphaConfIntervals.adfInterval
        };
      };
      return {
        calculate: _calculate,
        getAlpha: _getAlpha
      };
    }
  ]);

}).call(this);

//# sourceMappingURL=instrPerfEval.js.map